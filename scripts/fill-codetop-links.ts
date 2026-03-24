import fs from "fs/promises";
import path from "path";

const CODETOP_FILE = "codeTop.md";

// 提取题目标题信息（只识别真正的“题目标题”，过滤掉“Java实现（前缀和+哈希表）”这种）
function parseTitle(line: string) {
  const trimmed = line.trim();
  // 只接受这些难度关键字
  const diffPattern = "(简单|中等|困难|容易|Easy|Medium|Hard)";

  // 形如： "141. 环形链表（容易）"
  const m1 = trimmed.match(new RegExp(`^(\\d+)\\.\\s*(.+?)（${diffPattern}）`));
  if (m1) {
    return {
      raw: trimmed,
      number: m1[1],
      titleCn: m1[2],
      difficulty: m1[3],
    };
  }
  // 形如："反转链表II（中等）"
  const m2 = trimmed.match(new RegExp(`^(.+?)（${diffPattern}）`));
  if (m2) {
    return {
      raw: trimmed,
      number: null as string | null,
      titleCn: m2[1],
      difficulty: m2[2],
    };
  }
  return null;
}

async function main() {
  const filePath = path.join(process.cwd(), CODETOP_FILE);
  const raw = await fs.readFile(filePath, "utf8");
  const lines = raw.split("\n");

  let handledCount = 0;

  // 遍历所有行，遇到标题就就地插入链接行
  for (let i = 0; i < lines.length; i++) {
    const info = parseTitle(lines[i]);
    if (!info) continue;

    console.log(
      `处理标题行 [${i + 1}]: ${info.raw}（${info.number ?? "-"}）`,
    );

    const insertPos = i + 1;
    const nextLine = lines[insertPos] ?? "";
    const hasExistingLink = nextLine.trim().startsWith("leetcode:");

    if (hasExistingLink) {
      console.log("  已存在 leetcode 链接，跳过。");
      continue;
    }

    // 这里不再访问网络，而是统一插入占位链接，方便你之后手动补 slug
    const prefix =
      info.number != null ? `${info.number}. ${info.titleCn}` : info.titleCn;
    const placeholder = `leetcode: https://leetcode.cn/problems/<slug>  // ${prefix}`;
    lines.splice(insertPos, 0, placeholder, "");
    i += 1; // 跳过新插入行，避免死循环

    handledCount++;
  }

  await fs.writeFile(filePath, lines.join("\n"), "utf8");
  console.log(
    `\n✅ 已更新 ${CODETOP_FILE}，为 ${handledCount} 个标题尝试添加 leetcode 链接。`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

