import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 只匹配 10 位纯数字的 pid（未带 lc- 的旧 leetcode100 题） */
const LEGACY_PID_REGEX = /^\d{10}$/;

async function main() {
  const problems = await prisma.problem.findMany({
    where: { platform: "LEETCODE" },
    select: { id: true, pid: true, title: true },
  });

  const toUpdate = problems.filter((p) => LEGACY_PID_REGEX.test(p.pid));

  if (toUpdate.length === 0) {
    console.log("没有需要迁移的题目（未发现 10 位纯数字 pid）。");
    return;
  }

  console.log(`发现 ${toUpdate.length} 条 LEETCODE 题目 pid 为 10 位数字，将加上 lc- 前缀。`);

  for (const p of toUpdate) {
    const newPid = `lc-${p.pid}`;
    await prisma.problem.update({
      where: { id: p.id },
      data: { pid: newPid },
    });
    console.log(`  ${p.pid} -> ${newPid}  (${p.title})`);
  }

  console.log(`\n✅ 迁移完成，共更新 ${toUpdate.length} 条。`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
