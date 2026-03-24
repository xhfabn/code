/**
 * 从 code.md 导入题目到 Prisma
 * 格式：标题（简单|中等|困难）、可选 leetcode 链接、代码、题末分隔线 ========
 * 规则：从今天开始，每天 2 道题，自动加一天
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface ParsedProblem {
  title: string;
  difficulty: string;
  url: string;
  tags: string[];
  code: string;
}

function normalizeDifficultyLabel(diff: string): "Easy" | "Medium" | "Hard" {
  const d = diff.toLowerCase();
  if (d.includes("easy") || d.includes("简单")) return "Easy";
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

const LEETCODE_URL_PATTERN = /^https?:\/\/(leetcode\.cn|leetcode\.com)\/[\S]*$/;

// 解析 code.md：按标题 + 可选 leetcode 链接行拆题目，并收集后面的代码/题解
// 支持两种格式：1) leetcode: https://...  2) 标题下一行直接是 https://leetcode.cn/...
// 支持题末分隔线 ========，无链接的题也会导入（url 为空）
function parseCodeMd(content: string): ParsedProblem[] {
  const problems: ParsedProblem[] = [];
  const titlePattern = /^(.+?)（(简单|中等|困难|Easy|Medium|Hard)）\s*$/;
  const lines = content.split("\n");

  let current: ParsedProblem | null = null;
  let currentTitleLineIndex = -1;
  let currentUrlLineIndex = -1;

  function flush(endIndex: number) {
    if (!current) return;
    const codeStart =
      currentUrlLineIndex >= 0
        ? currentUrlLineIndex + 1
        : currentTitleLineIndex + 1;
    const codeLines = lines.slice(codeStart, endIndex);
    current.code = codeLines.join("\n").trim();
    problems.push(current);
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 题末分隔线：收尾当前题
    if (trimmed === "========") {
      flush(i);
      current = null;
      continue;
    }

    // 检查是否是标题行
    const titleMatch = trimmed.match(titlePattern);
    if (titleMatch) {
      flush(i); // 收尾上一题（若有）

      current = {
        title: titleMatch[1],
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

    // 提取 leetcode 链接：leetcode: https://... 或 单独一行 https://leetcode.cn/...
    if (trimmed.startsWith("leetcode:")) {
      const urlMatch = rawLine.match(/https?:\/\/\S+/);
      current.url = urlMatch ? urlMatch[0] : trimmed.replace("leetcode:", "").trim();
      currentUrlLineIndex = i;
      continue;
    }
    if (LEETCODE_URL_PATTERN.test(trimmed)) {
      current.url = trimmed;
      currentUrlLineIndex = i;
      continue;
    }
  }

  flush(lines.length);
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

function getNextReviewDate(intervalDays: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + intervalDays);
  d.setHours(6, 0, 0, 0);
  return d;
}

async function importCode() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.error("No user found. Please create a user first.");
      process.exit(1);
    }

    console.log(`Using user: ${user.username}`);

    // 读取 code.md：可传参 npm run import:code -- ../code.md；否则先找 code.md（当前目录或上一级）
    const cwd = process.cwd();
    const argPath = process.argv[2];
    const resolvedPath = argPath
      ? (path.isAbsolute(argPath) ? argPath : path.join(cwd, argPath))
      : (fs.existsSync(path.join(cwd, "code.md"))
          ? path.join(cwd, "code.md")
          : path.join(cwd, "..", "code.md"));

    if (!fs.existsSync(resolvedPath)) {
      console.error(`File not found: ${resolvedPath}`);
      console.error("Usage: npm run import:code [path/to/code.md]");
      process.exit(1);
    }

    const content = fs.readFileSync(resolvedPath, "utf-8");
    const problems = parseCodeMd(content);

    console.log(`Parsed ${problems.length} problems from ${path.basename(resolvedPath)}`);

    if (problems.length === 0) {
      console.log("No problems found to import");
      process.exit(0);
    }

    let importedCount = 0;

    // 从今天开始（当天 0 点）
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    console.log(`📅 Start date (today): ${startDate.toISOString().slice(0, 10)}`);

    // 复习排期：每天 2 道题，从当前日期往后排
    // 第 0~1 题 → 今天 6:00，第 2~3 题 → 明天 6:00，第 4~5 题 → 后天 6:00 ...
    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];
      const difficultyLabel = normalizeDifficultyLabel(problem.difficulty);

      // 每 2 题同一天，从今天开始
      const dayOffset = Math.floor(i / 2);
      const date = addDays(startDate, dayOffset);
      const dateStr = formatDate(date);
      const posInDay = (i % 2) + 1; // 1~2
      const suffix = String(posInDay).padStart(2, "0");
      const pid = `code-${dateStr}-${suffix}`;

      const slug = getSlugFromUrl(problem.url);
      const nextReview = getNextReviewDate(dayOffset);

      try {
        // 创建或更新 Problem
        const dbProblem = await prisma.problem.upsert({
          where: {
            platform_pid: {
              platform: "LEETCODE",
              pid,
            },
          },
          update: {
            title: problem.title,
            difficulty: difficultyLabel,
            difficultyLevel: mapDifficultyToLevel(difficultyLabel),
            tags: problem.tags.join(","),
            url: problem.url || null,
            slug,
          },
          create: {
            platform: "LEETCODE",
            pid,
            title: problem.title,
            difficulty: difficultyLabel,
            difficultyLevel: mapDifficultyToLevel(difficultyLabel),
            tags: problem.tags.join(","),
            url: problem.url || null,
            slug,
          },
        });

        // 为该用户创建/更新 Progress
        const progress = await prisma.progress.upsert({
          where: {
            userId_problemId: {
              userId: user.id,
              problemId: dbProblem.id,
            },
          },
          update: {
            status: "Reviewing",
            nextReview,
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
            nextReview,
          },
        });

        // 为该 Progress 写入或更新一份主代码 Submission（language 固定为 java）
        const existingMain = await prisma.submission.findFirst({
          where: {
            progressId: progress.id,
            isMain: true,
          },
        });

        if (existingMain) {
          await prisma.submission.update({
            where: { id: existingMain.id },
            data: {
              language: "java",
              code: problem.code,
              isMain: true,
            },
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
          console.log(`Imported ${importedCount}/${problems.length}...`);
        }
      } catch (error) {
        console.error(`Failed to import problem: ${problem.title}`, error);
      }
    }

    console.log(`\n✅ Successfully imported ${importedCount} problems`);
    console.log(
      `📅 Problems distributed across ${Math.ceil(problems.length / 2)} days`
    );
    console.log(`   - 2 problems per day starting from today`);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importCode();
