/**
 * 重排学习计划脚本
 *
 * 规则：
 * 1. 熟悉度 > 0 的为「复习题」，保持 SRS 排期，逾期的并入今天，超出每日上限则顺延
 * 2. 熟悉度 = 0 的为「新学题」，从今天起每天最多安排 2 道，填入复习后剩余的空位
 * 3. 每天总量上限 20（复习优先），超出的顺延到下一天
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DAILY_LIMIT = 20;
const NEW_PER_DAY = 2;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** 当天早上 6 点作为复习时间 */
function reviewTimeForDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(6, 0, 0, 0);
  return d;
}

async function reschedule() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("未找到用户，请先创建用户。");
    process.exit(1);
  }
  console.log(`用户: ${user.username}`);

  const today = startOfDay(new Date());
  console.log(`今天: ${today.toISOString().split("T")[0]}\n`);

  // 获取所有进度记录
  const allProgress = await prisma.progress.findMany({
    where: { userId: user.id },
    include: { problem: { select: { pid: true, title: true } } },
  });

  // 分离复习题 vs 新学题
  const reviews = allProgress.filter((p) => p.masteryLevel > 0);
  const newProblems = allProgress.filter((p) => p.masteryLevel === 0);

  console.log(`复习题 (masteryLevel > 0): ${reviews.length}`);
  console.log(`新学题 (masteryLevel = 0): ${newProblems.length}`);

  // -----------------------------------------------------------------------
  // 第一步：安排复习题
  // 策略：按原 nextReview 升序（逾期的等同于今天），贪心地分配到不超过 DAILY_LIMIT 的天
  // -----------------------------------------------------------------------
  reviews.sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime());

  const totalPerDay = new Map<number, number>(); // dayOffset -> 当天总数量（复习+新学）
  const reviewUpdates: { id: string; nextReview: Date }[] = [];

  for (const review of reviews) {
    const originalDay = startOfDay(review.nextReview);
    // 逾期的并入今天
    let offset = Math.round(
      (originalDay.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (offset < 0) offset = 0;

    // 找第一个还有空位的天
    while ((totalPerDay.get(offset) ?? 0) >= DAILY_LIMIT) {
      offset++;
    }

    totalPerDay.set(offset, (totalPerDay.get(offset) ?? 0) + 1);
    reviewUpdates.push({
      id: review.id,
      nextReview: reviewTimeForDay(addDays(today, offset)),
    });
  }

  // -----------------------------------------------------------------------
  // 第二步：安排新学题
  // 策略：从今天起，每天最多 NEW_PER_DAY 道，填入复习后剩余的空位（总量不超过 DAILY_LIMIT）
  // 新学题按原 nextReview 升序（旧日期优先）
  // -----------------------------------------------------------------------
  newProblems.sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime());

  const newPerDay = new Map<number, number>(); // dayOffset -> 当天新学数量
  const newUpdates: { id: string; nextReview: Date }[] = [];

  for (const np of newProblems) {
    let offset = 0;

    while (true) {
      const total = totalPerDay.get(offset) ?? 0;
      const newCount = newPerDay.get(offset) ?? 0;

      if (total < DAILY_LIMIT && newCount < NEW_PER_DAY) {
        // 分配到这一天
        totalPerDay.set(offset, total + 1);
        newPerDay.set(offset, newCount + 1);
        newUpdates.push({
          id: np.id,
          nextReview: reviewTimeForDay(addDays(today, offset)),
        });
        break;
      } else {
        offset++;
      }
    }
  }

  // -----------------------------------------------------------------------
  // 第三步：写入数据库
  // -----------------------------------------------------------------------
  console.log(`\n正在更新复习题排期: ${reviewUpdates.length} 条...`);
  let count = 0;
  for (const u of reviewUpdates) {
    await prisma.progress.update({
      where: { id: u.id },
      data: { nextReview: u.nextReview },
    });
    if (++count % 50 === 0) console.log(`  已更新 ${count}/${reviewUpdates.length}...`);
  }

  console.log(`正在更新新学题排期: ${newUpdates.length} 条...`);
  count = 0;
  for (const u of newUpdates) {
    await prisma.progress.update({
      where: { id: u.id },
      data: { nextReview: u.nextReview },
    });
    if (++count % 50 === 0) console.log(`  已更新 ${count}/${newUpdates.length}...`);
  }

  // -----------------------------------------------------------------------
  // 打印前 14 天预览
  // -----------------------------------------------------------------------
  const preview = new Map<number, { review: number; newLearn: number }>();
  for (const u of reviewUpdates) {
    const offset = Math.round(
      (startOfDay(u.nextReview).getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (!preview.has(offset)) preview.set(offset, { review: 0, newLearn: 0 });
    preview.get(offset)!.review++;
  }
  for (const u of newUpdates) {
    const offset = Math.round(
      (startOfDay(u.nextReview).getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (!preview.has(offset)) preview.set(offset, { review: 0, newLearn: 0 });
    preview.get(offset)!.newLearn++;
  }

  console.log("\n📅 未来 14 天学习预览:");
  console.log("日期           复习   新学   合计");
  console.log("─────────────────────────────────");
  const sortedOffsets = Array.from(preview.keys())
    .sort((a, b) => a - b)
    .slice(0, 14);
  for (const offset of sortedOffsets) {
    const date = addDays(today, offset);
    const dateStr = date.toISOString().split("T")[0];
    const { review, newLearn } = preview.get(offset)!;
    const total = review + newLearn;
    const bar = offset === 0 ? " ← 今天" : "";
    console.log(
      `${dateStr}   ${String(review).padStart(4)}  ${String(newLearn).padStart(4)}  ${String(total).padStart(4)}${bar}`
    );
  }

  const totalDaysForNew =
    newUpdates.length > 0
      ? Math.round(
          (startOfDay(newUpdates[newUpdates.length - 1].nextReview).getTime() -
            today.getTime()) /
            (24 * 60 * 60 * 1000)
        )
      : 0;

  console.log(`\n✅ 重排完成！`);
  console.log(`   复习题更新: ${reviewUpdates.length} 条`);
  console.log(`   新学题更新: ${newUpdates.length} 条（共 ${Math.ceil(newUpdates.length / NEW_PER_DAY)} 天排完，约 ${totalDaysForNew} 天后）`);
  console.log(`   每日上限: ${DAILY_LIMIT}（复习优先），新学每天最多 ${NEW_PER_DAY} 道`);
}

reschedule()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
