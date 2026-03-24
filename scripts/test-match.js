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

// 获取所有题目列表
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

  const result = await makeRequest('leetcode.cn', '/graphql/', query);
  if (result.data && result.data.problemsetQuestionList) {
    return result.data.problemsetQuestionList.questions;
  }
  throw new Error('Failed to get problems');
}

async function test() {
  const allProblems = await getAllProblems();

  // 查找"二叉树的锯齿形层次遍历"
  const searchName = "二叉树的锯齿形层次遍历";
  const cleanName = searchName.replace(/\s+/g, '').replace(/[（）\(\)]/g, '').toLowerCase();

  console.log('搜索:', searchName);
  console.log('清理后:', cleanName);
  console.log('\n匹配结果:');

  for (const p of allProblems) {
    const title = (p.translatedTitle || p.title || '').replace(/\s+/g, '').replace(/[（）\(\)]/g, '').toLowerCase();
    if (title.includes('锯齿') || title.includes('zigzag')) {
      console.log('\n找到相关题目:');
      console.log('  编号:', p.questionFrontendId);
      console.log('  标题:', p.translatedTitle);
      console.log('  slug:', p.titleSlug);
      console.log('  清理后标题:', title);
      console.log('  是否匹配:', title === cleanName || title.includes(cleanName) || cleanName.includes(title));
    }
  }
}

test().catch(console.error);
