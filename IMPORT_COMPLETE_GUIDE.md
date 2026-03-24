# LeetCode 批量导入完整指南

## 📋 概述

这套脚本系统用于批量导入 LeetCode 题目，并按照科学的学习计划逐步加入学习任务。

### 核心特性

- ✅ **批量导入**：一次导入 97 道 LeetCode 题目
- ✅ **智能分配**：每 3 道题对应一天，避免单日学习量暴增
- ✅ **自动调度**：系统自动按日期将题目加入学习计划
- ✅ **SRS 算法**：集成间隔重复算法，优化学习效率
- ✅ **灵活配置**：支持自定义分配规则

## 🚀 快速开始

### 1. 导入题目

```bash
npm run import:leetcode
```

**输出示例：**
```
Using user: 王朝
Parsed 97 problems from markdown
Imported 10/97 problems...
...
✅ Successfully imported 97 problems
📅 Problems distributed across 33 days
   - 3 problems per day starting from tomorrow
```

### 2. 验证导入结果

```bash
npm run verify:import
```

**输出示例：**
```
📊 Import Verification Report
============================================================
User: 王朝
Total Problems Imported: 97

📅 Learning Schedule Distribution:
============================================================
Day 1 (2026-02-13): 3 problems
  - 两数之和 (简单)
  - 无重复字符的最长子串 (中等)
  - 两数相加 (中等)
...

📈 Difficulty Distribution:
============================================================
简单: 20 (20.6%)
中等: 67 (69.1%)
困难: 10 (10.3%)

✅ All problems are in "Todo" status and ready for scheduling
```

### 3. 每日自动添加题目

```bash
npm run add:daily
```

**输出示例：**
```
📚 Adding 3 problems to today's learning plan
============================================================

✅ Successfully added 3 problems to learning plan

Problems added:
1. 两数之和 (简单)
2. 无重复字符的最长子串 (中等)
3. 两数相加 (中等)
```

## 📊 工作流程

### 导入流程

```
Markdown 文件
    ↓
解析题目信息
    ↓
创建 Problem 记录
    ↓
创建 Progress 记录 (status = "Todo")
    ↓
计算 nextReview 日期
    ↓
存入数据库
```

### 学习流程

```
导入完成 (status = "Todo")
    ↓
每天运行 add:daily 脚本
    ↓
检查 nextReview 日期
    ↓
将到期题目加入学习计划 (status = "Reviewing")
    ↓
用户完成题目并评分
    ↓
SRS 算法计算下次复习时间
    ↓
循环...
```

## 🗓️ 学习计划示例

导入 97 道题目后，学习计划如下：

| 日期 | 题目数 | 难度分布 | 示例题目 |
|------|--------|---------|---------|
| 2026-02-13 | 3 | 1简 2中 | 两数之和、无重复字符的最长子串、两数相加 |
| 2026-02-14 | 3 | 3中 | 最长回文子串、盛水最多的容器、三数之和 |
| 2026-02-15 | 3 | 2中 1简 | 电话号码的字母组合、删除链表的倒数第N个结点、有效的括号 |
| ... | ... | ... | ... |
| 2026-03-17 | 1 | 1中 | 编辑距离 |

**总计：33 天，每天 3 道题（最后一天 1 道）**

## 🔧 配置和自定义

### 修改每日题目数量

编辑 `scripts/import-leetcode.ts`，修改 `dayOffset` 计算：

```typescript
// 当前：每 3 道题 = 1 天
const dayOffset = Math.floor(i / 3) + 1;

// 改为每 5 道题 = 1 天
const dayOffset = Math.floor(i / 5) + 1;

// 改为每 2 道题 = 1 天
const dayOffset = Math.floor(i / 2) + 1;
```

### 修改起始日期

编辑 `scripts/import-leetcode.ts`，修改 `today` 的计算：

```typescript
// 当前：从明天开始
const today = new Date();
today.setHours(0, 0, 0, 0);

// 改为从后天开始
const today = new Date();
today.setDate(today.getDate() - 1);
today.setHours(0, 0, 0, 0);
```

## 📱 在应用中查看

导入完成后，在应用中查看题目：

1. **题目列表页面**：`/questions`
   - 显示所有导入的题目
   - 可以按难度、标签筛选
   - 可以查看每道题的详细信息

2. **学习计划页面**：`/review`
   - 显示今日需要学习的题目
   - 显示复习计划
   - 可以标记完成和评分

3. **仪表板页面**：`/home`
   - 显示学习统计
   - 显示学习进度
   - 显示复习提醒

## 🔄 定时任务设置

为了自动每天添加题目，可以设置定时任务：

### 使用 cron（Linux/Mac）

```bash
# 每天早上 6 点运行
0 6 * * * cd /path/to/project && npm run add:daily
```

### 使用 Windows 任务计划

1. 打开"任务计划程序"
2. 创建基本任务
3. 设置触发器：每天 6:00 AM
4. 设置操作：运行程序
   - 程序：`npm`
   - 参数：`run add:daily`
   - 起始于：`/path/to/project`

### 使用 Node.js 定时库

创建 `scripts/scheduler.ts`：

```typescript
import cron from 'node-cron';
import { exec } from 'child_process';

// 每天早上 6 点运行
cron.schedule('0 6 * * *', () => {
  console.log('Running daily problem addition...');
  exec('npm run add:daily', (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      return;
    }
    console.log(stdout);
  });
});

console.log('Scheduler started');
```

## 🐛 故障排除

### 问题 1：导入失败 - "No user found"

**原因**：数据库中没有用户账户

**解决方案**：
1. 打开应用
2. 完成注册流程
3. 重新运行导入脚本

### 问题 2：导入失败 - "File not found"

**原因**：`leetcode100_new.md` 文件不在项目根目录

**解决方案**：
1. 确保文件位置：`/path/to/project/leetcode100_new.md`
2. 检查文件名是否正确
3. 确保文件有读取权限

### 问题 3：导入缓慢

**原因**：大量数据库操作

**解决方案**：
- 这是正常的，脚本会每 10 个题目输出进度
- 导入 97 道题目通常需要 10-30 秒

### 问题 4：重复导入

**原因**：多次运行导入脚本

**解决方案**：
- 脚本使用 `upsert` 操作，相同题目会被更新
- 如果需要重新导入，先删除旧数据：

```typescript
// 在 import-leetcode.ts 中添加
await prisma.progress.deleteMany({
  where: { userId: user.id }
});
```

## 📚 数据库结构

### Problem 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| platform | String | 平台（LEETCODE） |
| pid | String | 平台题目 ID |
| title | String | 题目标题 |
| difficulty | String | 难度（简单/中等/困难） |
| difficultyLevel | Int | 难度等级（1/2/3） |
| tags | String | 标签（逗号分隔） |
| url | String | 题目链接 |

### Progress 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| userId | String | 用户 ID |
| problemId | String | 题目 ID |
| status | String | 状态（Todo/Reviewing/Solved） |
| masteryLevel | Int | 掌握程度（0-5） |
| reviewCount | Int | 复习次数 |
| interval | Int | 复习间隔（天） |
| easiness | Float | 难度系数（SRS） |
| nextReview | DateTime | 下次复习时间 |
| lastReview | DateTime | 最后复习时间 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

## 🎯 最佳实践

1. **定期复习**：按照系统推荐的时间复习题目
2. **认真评分**：准确评估掌握程度，帮助 SRS 算法优化
3. **记录笔记**：在题目页面记录解题思路和关键点
4. **多语言实现**：尝试用不同编程语言实现同一道题
5. **定期总结**：查看学习统计，分析薄弱环节

## 📖 相关文档

- [Markdown 文件格式](./IMPORT_GUIDE.md#文件格式)
- [SRS 算法说明](./src/lib/srs.ts)
- [API 文档](./src/actions/questions.ts)

## 🤝 贡献

如果你有改进建议，欢迎提交 Issue 或 Pull Request。

## 📝 许可证

MIT
