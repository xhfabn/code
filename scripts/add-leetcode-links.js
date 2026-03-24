const fs = require('fs');
const https = require('https');

// 发送 HTTPS 请求
function makeRequest(hostname, path, postData) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname,
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://leetcode.cn/'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          console.error('解析响应失败:', data);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// 获取所有题目列表（使用正确的 API）
async function getAllProblems() {
  const query = JSON.stringify({
    query: `
      query problemsetQuestionList {
        problemsetQuestionList {
          total
          questions {
            questionFrontendId
            title
            titleSlug
            translatedTitle
          }
        }
      }
    `,
    variables: {}
  });

  try {
    const result = await makeRequest('leetcode.cn', '/graphql/', query);

    if (result.errors) {
      console.error('GraphQL 错误:', JSON.stringify(result.errors, null, 2));
      // 尝试另一个查询方式
      return await getAllProblemsAlternative();
    }

    if (result.data && result.data.problemsetQuestionList) {
      return result.data.problemsetQuestionList.questions;
    }

    throw new Error('未能获取题目列表');
  } catch (e) {
    console.error('API 请求失败，尝试备用方法...');
    return await getAllProblemsAlternative();
  }
}

// 备用方法：通过 API v2 获取
async function getAllProblemsAlternative() {
  const query = JSON.stringify({
    operationName: "allQuestions",
    query: `
      query allQuestions {
        allQuestions {
          questionFrontendId
          title
          titleSlug
          translatedTitle
        }
      }
    `
  });

  const result = await makeRequest('leetcode.cn', '/graphql/', query);

  if (result.data && result.data.allQuestions) {
    return result.data.allQuestions;
  }

  throw new Error('备用 API 也失败了');
}

// 解析题目标题
function parseProblemTitle(line) {
  // 匹配格式: "编号. 题目名称（难度）"
  const patterns = [
    // 标准 LeetCode 题目: "141. 环形链表（容易）"
    /^(\d+)\.\s*(.+?)[（\(](简单|中等|困难|容易|hard|medium|easy)[）\)]$/,
    // 剑指 Offer: "剑指 Offer 22. 链表中倒数第k个节点（容易）"
    /^剑指\s*Offer\s+(\d+[A-Z\-]*)\.\s*(.+?)[（\(](简单|中等|困难|容易)[）\)]$/,
    // 补充题: "补充题6. 手撕堆排序（中等）"
    /^补充题(\d+)\.\s*(.+?)[（\(](简单|中等|困难|容易)[）\)]$/,
    // 只有题目名称: "反转链表II（中等）"
    /^([^0-9补剑].+?)[（\(](简单|中等|困难|容易)[）\)]$/
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      if (pattern === patterns[0]) {
        // 标准题目
        return {
          type: 'leetcode',
          id: match[1],
          name: match[2].trim(),
          difficulty: match[3],
          fullLine: line
        };
      } else if (pattern === patterns[1]) {
        // 剑指 Offer
        return {
          type: 'offer',
          id: match[1],
          name: match[2].trim(),
          difficulty: match[3],
          fullLine: line
        };
      } else if (pattern === patterns[2]) {
        // 补充题
        return {
          type: 'supplement',
          id: match[1],
          name: match[2].trim(),
          difficulty: match[3],
          fullLine: line
        };
      } else {
        // 只有名称
        return {
          type: 'name-only',
          id: null,
          name: match[1].trim(),
          difficulty: match[2],
          fullLine: line
        };
      }
    }
  }

  return null;
}

// 手动映射表（用于处理API无法匹配的题目）
const manualMapping = {
  '反转链表ii': { id: '92', slug: 'reverse-linked-list-ii' },
  '反转链表2': { id: '92', slug: 'reverse-linked-list-ii' },
  '二叉树的锯齿形层次遍历': { id: '103', slug: 'binary-tree-zigzag-level-order-traversal' },
  '二叉树的锯齿形层序遍历': { id: '103', slug: 'binary-tree-zigzag-level-order-traversal' },
  '删除链表的倒数第n个节点': { id: '19', slug: 'remove-nth-node-from-end-of-list' },
  '求根到叶子节点数字之和': { id: '129', slug: 'sum-root-to-leaf-numbers' },
  '求根节点到叶节点数字之和': { id: '129', slug: 'sum-root-to-leaf-numbers' },
  '复制带随机指针的链表': { id: '138', slug: 'copy-list-with-random-pointer' },
  '另一个树的子树': { id: '572', slug: 'subtree-of-another-tree' },
  '另一棵树的子树': { id: '572', slug: 'subtree-of-another-tree' }
};

// 查找匹配的题目
function findMatchingProblem(problem, allProblems) {
  const cleanName = problem.name.replace(/\s+/g, '').replace(/[（）\(\)]/g, '').toLowerCase();

  // 先检查手动映射表
  if (manualMapping[cleanName]) {
    return {
      questionFrontendId: manualMapping[cleanName].id,
      titleSlug: manualMapping[cleanName].slug
    };
  }

  // 先通过编号匹配，但需要验证名称是否也匹配
  if (problem.id && problem.type === 'leetcode') {
    const match = allProblems.find(p => p.questionFrontendId === problem.id);
    if (match) {
      // 验证名称是否匹配
      const matchTitle = (match.translatedTitle || match.title || '').replace(/\s+/g, '').replace(/[（）\(\)]/g, '').toLowerCase();
      if (matchTitle.includes(cleanName) || cleanName.includes(matchTitle)) {
        return match; // 编号和名称都匹配，返回
      }
      // 编号匹配但名称不匹配，继续通过名称查找
    }
  }

  // 通过名称匹配
  for (const p of allProblems) {
    const title = (p.translatedTitle || p.title || '').replace(/\s+/g, '').replace(/[（）\(\)]/g, '').toLowerCase();
    // 要求至少有一定的匹配度
    if (title === cleanName) {
      return p; // 完全匹配
    }
    if (title.length > 3 && cleanName.length > 3 &&
        (title.includes(cleanName) || cleanName.includes(title))) {
      return p;
    }
  }

  return null;
}

// 主函数
async function main() {
  try {
    console.log('正在获取 LeetCode 题目列表...');
    let allProblems;

    try {
      allProblems = await getAllProblems();
      console.log(`成功获取到 ${allProblems.length} 道题目`);
    } catch (e) {
      console.error('无法从 API 获取题目列表，将使用本地匹配方法');
      allProblems = [];
    }

    console.log('\n正在读取 codetop.md 文件...');
    const content = fs.readFileSync('/Users/wujiawei/JavaProjects/ReCode/codeTop.md', 'utf-8');
    const lines = content.split('\n');

    const newLines = [];
    let modifiedCount = 0;
    let notFoundCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      const problem = parseProblemTitle(trimmedLine);

      if (problem) {
        // 检查下一行是否已经有 leetcode 链接
        const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
        if (nextLine.startsWith('leetcode:')) {
          // 已经有链接了，跳过
          newLines.push(line);
          continue;
        }

        let slug = null;

        // 对于标准 LeetCode 题目和无编号题目，尝试查找匹配
        if ((problem.type === 'leetcode' || problem.type === 'name-only') && allProblems.length > 0) {
          const match = findMatchingProblem(problem, allProblems);
          if (match) {
            slug = match.titleSlug;
          }
        } else if (problem.type === 'offer') {
          // 剑指 Offer 题目通常以 lcof 开头
          const offerNum = problem.id.toLowerCase().replace(/\s+/g, '-');
          slug = `jian-zhi-offer-${offerNum}`;
        }

        newLines.push(line);
        if (slug) {
          newLines.push(`leetcode: https://leetcode.cn/problems/${slug}/`);
          modifiedCount++;
          console.log(`✓ [${problem.type}] ${problem.id ? problem.id + '. ' : ''}${problem.name} -> ${slug}`);
        } else {
          notFoundCount++;
          console.log(`✗ [${problem.type}] ${problem.id ? problem.id + '. ' : ''}${problem.name}`);
        }
      } else {
        newLines.push(line);
      }
    }

    console.log(`\n共添加了 ${modifiedCount} 个链接`);
    console.log(`未找到 ${notFoundCount} 个题目的链接`);

    // 写回文件
    const backupPath = '/Users/wujiawei/JavaProjects/ReCode/codeTop.md.backup';
    fs.writeFileSync(backupPath, content, 'utf-8');
    console.log(`\n原文件已备份到: ${backupPath}`);

    fs.writeFileSync('/Users/wujiawei/JavaProjects/ReCode/codeTop.md', newLines.join('\n'), 'utf-8');
    console.log('文件已更新！');

  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

main();
