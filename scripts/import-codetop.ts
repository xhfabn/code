import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface ParsedProblem {
  title: string;
  difficulty: string;
  url: string; // 补充题无链接，为空字符串
  tags: string[];
  code: string;
}

// 补充题（标题以「补充题」开头）非 LeetCode 官方题，导入时不填链接
function isSupplement(title: string): boolean {
  const t = title.trim();
  return t.startsWith("补充题");
}

function normalizeDifficultyLabel(diff: string): "Easy" | "Medium" | "Hard" {
  const d = diff.toLowerCase();
  if (d.includes("easy") || d.includes("简单") || d.includes("容易"))
    return "Easy";
  if (d.includes("hard") || d.includes("困难")) return "Hard";
  return "Medium";
}

function mapDifficultyToLevel(diff: string): number {
  const label = normalizeDifficultyLabel(diff);
  if (label === "Easy") return 1;
  if (label === "Hard") return 3;
  return 2;
}

function getInitialEasiness(diff: string): number {
  const level = mapDifficultyToLevel(diff);
  if (level === 3) return 2.4;
  if (level === 1) return 2.6;
  return 2.5;
}

function getSlugFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  const m = url.match(/problems\/([^/?]+)/);
  return m ? m[1] : null;
}

/** 规范化 URL 便于去重比较（去掉末尾斜杠、空白） */
function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, "") || "";
}

// 解析 codeTop.md：标题含「补充题」或「数字. xxx（难度）」或「xxx（难度）」；下一行可有 leetcode:；补充题无链接也收入
function parseCodeTopMd(content: string): ParsedProblem[] {
  const problems: ParsedProblem[] = [];
  const titlePattern =
    /^(.+?)（(简单|中等|困难|容易|Easy|Medium|Hard)）\s*$/;
  const lines = content.split("\n");

  let current: ParsedProblem | null = null;
  let currentTitleLineIndex = -1;
  let currentUrlLineIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    const titleMatch = trimmed.match(titlePattern);
    if (titleMatch) {
      // 收尾上一题（不论是否有 url，都 push，以支持补充题）
      if (current) {
        const codeStart =
          currentUrlLineIndex >= 0
            ? currentUrlLineIndex + 1
            : currentTitleLineIndex + 1;
        const codeLines = lines.slice(codeStart, i);
        current.code = codeLines.join("\n").trim();
        problems.push(current);
      }

      current = {
        title: titleMatch[1].trim(),
        difficulty: titleMatch[2],
        url: "",
        tags: [],
        code: "",
      };
      currentTitleLineIndex = i;
      currentUrlLineIndex = -1;
      continue;
    }

    if (!current) continue;

    if (trimmed.startsWith("leetcode:")) {
      const urlMatch = rawLine.match(/https?:\/\/\S+/);
      if (urlMatch) {
        current.url = urlMatch[0].trim().replace(/\/+$/, "") || "";
      } else {
        current.url = trimmed.replace("leetcode:", "").trim();
      }
      currentUrlLineIndex = i;
      continue;
    }
  }

  if (current) {
    const codeStart =
      currentUrlLineIndex >= 0
        ? currentUrlLineIndex + 1
        : currentTitleLineIndex + 1;
    const codeLines = lines.slice(codeStart);
    current.code = codeLines.join("\n").trim();
    problems.push(current);
  }

  return problems;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  return d;
}

async function importCodeTop() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.error("No user found. Please create a user first.");
      process.exit(1);
    }

    console.log(`Using user: ${user.username}`);

    const mdPath = path.join(process.cwd(), "codeTop.md");
    if (!fs.existsSync(mdPath)) {
      console.error(`File not found: ${mdPath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(mdPath, "utf-8");
    const parsed = parseCodeTopMd(content);

    console.log(`Parsed ${parsed.length} problems from codeTop.md`);

    // 从今天开始（当天 0 点）
    const startDate = startOfDay(new Date());

    console.log(
      `📅 Start date (today): ${startDate.toISOString().slice(0, 10)}`
    );

    // 已有题目的 URL 集合（用于去重）
    const existing = await prisma.problem.findMany({
      where: { platform: "LEETCODE", url: { not: null } },
      select: { url: true },
    });
    const existingUrls = new Set(
      existing.map((p) => p.url).filter(Boolean).map(normalizeUrl)
    );

    // 过滤：有链接且链接已存在则跳过（重复）；补充题无链接不按 URL 去重
    const toImport: ParsedProblem[] = [];
    let skippedDuplicate = 0;
    for (const p of parsed) {
      if (p.url) {
        const norm = normalizeUrl(p.url);
        if (existingUrls.has(norm)) {
          skippedDuplicate++;
          continue;
        }
      }
      toImport.push(p);
    }

    console.log(
      `🔄 After dedup: ${toImport.length} to import, ${skippedDuplicate} skipped (already in DB).`
    );

    let importedCount = 0;

    for (let i = 0; i < toImport.length; i++) {
      const problem = toImport[i];
      const difficultyLabel = normalizeDifficultyLabel(problem.difficulty);

      // 每 5 题同一天，从 startDate 开始；pid 加 ct- 前缀避免与 leetcode100 的 YYYYMMDD01 冲突
      const dayOffset = Math.floor(i / 5);
      const date = addDays(startDate, dayOffset);
      const dateStr = formatDate(date);
      const posInDay = (i % 5) + 1;
      const suffix = String(posInDay).padStart(2, "0");
      const pid = `ct-${dateStr}-${suffix}`;

      // 补充题不填链接（url 存 null）
      const urlToStore =
        problem.url && !isSupplement(problem.title) ? problem.url : null;
      const slug = urlToStore ? getSlugFromUrl(urlToStore) : null;

      const nextReviewDate = new Date(date);
      nextReviewDate.setHours(6, 0, 0, 0);

      try {
        const dbProblem = await prisma.problem.upsert({
          where: {
            platform_pid: { platform: "LEETCODE", pid },
          },
          update: {
            title: problem.title,
            difficulty: difficultyLabel,
            difficultyLevel: mapDifficultyToLevel(difficultyLabel),
            tags: problem.tags.join(","),
            url: urlToStore,
            slug,
          },
          create: {
            platform: "LEETCODE",
            pid,
            title: problem.title,
            difficulty: difficultyLabel,
            difficultyLevel: mapDifficultyToLevel(difficultyLabel),
            tags: problem.tags.join(","),
            url: urlToStore,
            slug,
          },
        });

        const progress = await prisma.progress.upsert({
          where: {
            userId_problemId: {
              userId: user.id,
              problemId: dbProblem.id,
            },
          },
          update: {
            status: "Reviewing",
            nextReview: nextReviewDate,
            interval: dayOffset,
            easiness: getInitialEasiness(difficultyLabel),
          },
          create: {
            userId: user.id,
            problemId: dbProblem.id,
            status: "Reviewing",
            masteryLevel: 0,
            notes: "",
            reviewCount: 0,
            interval: dayOffset,
            easiness: getInitialEasiness(difficultyLabel),
            lastReview: null,
            nextReview: nextReviewDate,
          },
        });

        const existingMain = await prisma.submission.findFirst({
          where: { progressId: progress.id, isMain: true },
        });

        if (existingMain) {
          await prisma.submission.update({
            where: { id: existingMain.id },
            data: { language: "java", code: problem.code, isMain: true },
          });
        } else {
          await prisma.submission.create({
            data: {
              progressId: progress.id,
              language: "java",
              code: problem.code,
              isMain: true,
            },
          });
        }

        importedCount++;
        if (importedCount % 10 === 0) {
          console.log(`Imported ${importedCount}/${toImport.length}...`);
        }
      } catch (error) {
        console.error(`Failed to import: ${problem.title}`, error);
      }
    }

    console.log(`\n✅ CodeTop import done: ${importedCount} problems`);
    console.log(
      `📅 Scheduled from ${startDate.toISOString().slice(0, 10)}, 5 per day.`
    );
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importCodeTop();
