题目记录
------------------

反转链表II（中等）
leetcode: https://leetcode.cn/problems/reverse-linked-list-ii/
给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 。
public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy=new ListNode(0,head);
        ListNode pre=dummy;
        for(int i=1;i<left;++i){
            pre=pre.next;
        }
        ListNode cur=pre.next;
        for(int i=0;i<right-left;++i){
            ListNode next=cur.next;
            cur.next=next.next;
            next.next=pre.next;
            pre.next=next;
        }
        return dummy.next;
    }

------------------

1. 二叉树的锯齿形层次遍历（中等）
leetcode: https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/
题目描述
给定二叉树，返回其锯齿形层序遍历结果（先从左到右，下一层从右到左，交替进行）。
示例
输入：root = [3,9,20,null,null,15,7]
输出：[[3],[20,9],[15,7]]
Java实现
class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        boolean isLeftToRight = true; // 标记当前层遍历方向

        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (isLeftToRight) {
                    level.add(node.val);
                } else {
                    level.add(0, node.val); // 逆序添加
                }
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            res.add(level);
            isLeftToRight = !isLeftToRight; // 切换方向
        }
        return res;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

141. 环形链表（容易）
leetcode: https://leetcode.cn/problems/linked-list-cycle/
题目描述
判断链表是否有环。
示例
输入：head = [3,2,0,-4], pos = 1（链表有环）
输出：true
Java实现（快慢指针）
public class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) return false;
        ListNode slow = head;
        ListNode fast = head.next;
        while (slow != fast) {
            if (fast == null || fast.next == null) return false;
            slow = slow.next;
            fast = fast.next.next;
        }
        return true;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) {
        val = x;
        next = null;
    }
}

------------------

54. 螺旋矩阵（中等）
leetcode: https://leetcode.cn/problems/spiral-matrix/
题目描述
给定m×n矩阵，按螺旋顺序返回所有元素。
示例
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,3,6,9,8,7,4,5]
Java实现
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        if (matrix == null || matrix.length == 0) return res;
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;

        while (true) {
            // 上边界：左→右
            for (int i = left; i <= right; i++) res.add(matrix[top][i]);
            if (++top > bottom) break;
            // 右边界：上→下
            for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);
            if (--right < left) break;
            // 下边界：右→左
            for (int i = right; i >= left; i--) res.add(matrix[bottom][i]);
            if (--bottom < top) break;
            // 左边界：下→上
            for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);
            if (++left > right) break;
        }
        return res;
    }
}

------------------

300. 最长上升子序列（中等）
leetcode: https://leetcode.cn/problems/longest-strictly-increasing-subsequence-with-non-zero-bitwise-and/
题目描述
给定整数数组，找出最长严格递增子序列的长度（子序列不要求连续）。
示例
输入：nums = [10,9,2,5,3,7,101,18]
输出：4（子序列 [2,5,7,101]）
Java实现（二分优化）
class Solution {
    public int lengthOfLIS(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        for (int num : nums) {
            // 找到第一个≥num的位置，替换为num
            int left = 0, right = tails.size();
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (tails.get(mid) < num) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            if (left == tails.size()) {
                tails.add(num);
            } else {
                tails.set(left, num);
            }
        }
        return tails.size();
    }
}

------------------

143. 重排链表（中等）
leetcode: https://leetcode.cn/problems/reorder-list/
题目描述
将链表 L0→L1→…→Ln-1→Ln 重排为 L0→Ln→L1→Ln-1→…（原地修改）。
示例
输入：head = [1,2,3,4]
输出：[1,4,2,3]
Java实现
class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        // 1. 找中点
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = slow.next;
        slow.next = null;
        // 2. 反转后半部分
        second = reverse(second);
        // 3. 合并两个链表
        merge(head, second);
    }

    private ListNode reverse(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    private void merge(ListNode l1, ListNode l2) {
        while (l1 != null && l2 != null) {
            ListNode l1Next = l1.next;
            ListNode l2Next = l2.next;
            l1.next = l2;
            l2.next = l1Next;
            l1 = l1Next;
            l2 = l2Next;
        }
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

23. 合并K个排序链表（困难）
leetcode: https://leetcode.cn/problems/sort-list/
题目描述
合并k个升序链表，返回合并后的升序链表。
示例
输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]
Java实现（优先队列）
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        // 小顶堆：按节点值排序
        PriorityQueue<ListNode> heap = new PriorityQueue<>(Comparator.comparingInt(node -> node.val));
        // 所有链表头节点入堆
        for (ListNode node : lists) {
            if (node != null) heap.offer(node);
        }

        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (!heap.isEmpty()) {
            ListNode minNode = heap.poll();
            curr.next = minNode;
            curr = curr.next;
            // 下一个节点入堆
            if (minNode.next != null) heap.offer(minNode.next);
        }
        return dummy.next;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

415. 字符串相加（容易）
leetcode: https://leetcode.cn/problems/add-strings/
题目描述
给定两个非负整数的字符串表示，返回它们的和（不能转成整数）。
示例
输入：num1 = "11", num2 = "123"
输出："134"
Java实现
class Solution {
    public String addStrings(String num1, String num2) {
        StringBuilder sb = new StringBuilder();
        int i = num1.length() - 1, j = num2.length() - 1;
        int carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int sum = carry;
            if (i >= 0) sum += num1.charAt(i--) - '0';
            if (j >= 0) sum += num2.charAt(j--) - '0';
            carry = sum / 10;
            sb.append(sum % 10);
        }
        return sb.reverse().toString();
    }
}

------------------

56. 合并区间（中等）
leetcode: https://leetcode.cn/problems/merge-intervals/
题目描述
给定区间数组，合并所有重叠的区间。
示例
输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
输出：[[1,6],[8,10],[15,18]]
Java实现
class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length == 0) return new int[0][2];
        // 按区间起始位置排序
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> res = new ArrayList<>();
        res.add(intervals[0]);

        for (int i = 1; i < intervals.length; i++) {
            int[] last = res.get(res.size() - 1);
            int[] curr = intervals[i];
            if (curr[0] <= last[1]) {
                // 重叠，合并区间
                last[1] = Math.max(last[1], curr[1]);
            } else {
                // 不重叠，加入新区间
                res.add(curr);
            }
        }
        return res.toArray(new int[res.size()][2]);
    }
}

------------------

160. 相交链表（容易）
leetcode: https://leetcode.cn/problems/intersection-of-two-linked-lists/
题目描述
找到两个单链表相交的起始节点。
示例
输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5]
输出：节点 8
Java实现（双指针）
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if (headA == null || headB == null) return null;
        ListNode a = headA, b = headB;
        // a遍历完A走B的路，b遍历完B走A的路，相遇则为交点
        while (a != b) {
            a = (a == null) ? headB : a.next;
            b = (b == null) ? headA : b.next;
        }
        return a;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) {
        val = x;
        next = null;
    }
}

------------------

42. 接雨水（困难）
leetcode: https://leetcode.cn/problems/trapping-rain-water/
题目描述
给定非负整数数组表示柱子高度，计算能接的雨水量。
示例
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
Java实现（双指针）
class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int res = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                // 左柱子更矮，以左最大高度计算
                leftMax = Math.max(leftMax, height[left]);
                res += leftMax - height[left];
                left++;
            } else {
                // 右柱子更矮，以右最大高度计算
                rightMax = Math.max(rightMax, height[right]);
                res += rightMax - height[right];
                right--;
            }
        }
        return res;
    }
}

------------------

72. 编辑距离（困难）
leetcode: https://leetcode.cn/problems/edit-distance/
题目描述
计算将字符串word1转换成word2所需的最少操作数（可执行增、删、改操作）。
示例
输入：word1 = "horse", word2 = "ros"
输出：3（horse→rorse→rose→ros）
Java实现（动态规划）
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        // dp[i][j]：word1前i个字符转word2前j个字符的最少操作数
        int[][] dp = new int[m+1][n+1];
        // 初始化：空串转成目标串需i次添加
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i-1) == word2.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    // 取删、增、改的最小值 +1
                    dp[i][j] = Math.min(Math.min(dp[i-1][j], dp[i][j-1]), dp[i-1][j-1]) + 1;
                }
            }
        }
        return dp[m][n];
    }
}

------------------

124. 二叉树中的最大路径和（困难）
leetcode: https://leetcode.cn/problems/binary-tree-maximum-path-sum/
题目描述
给定二叉树，找出任意节点之间路径的最大和（路径可包含任意数量的节点，但不能重复）。
示例
输入：root = [-10,9,20,null,null,15,7]
输出：42（路径 15→20→7）
Java实现
class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        dfs(root);
        return maxSum;
    }

    // 返回当前节点的最大贡献值（只能选左/右子树中的一个）
    private int dfs(TreeNode node) {
        if (node == null) return 0;
        // 左/右子树的贡献值（负数则取0，不选）
        int leftGain = Math.max(dfs(node.left), 0);
        int rightGain = Math.max(dfs(node.right), 0);
        // 当前节点的最大路径和（左+右+当前值）
        int currPathSum = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, currPathSum);
        // 返回当前节点的最大贡献值
        return node.val + Math.max(leftGain, rightGain);
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

1143. 最长公共子序列（中等）
leetcode: https://leetcode.cn/problems/longest-common-subsequence/
题目描述
给定两个字符串，找出它们的最长公共子序列的长度（子序列不要求连续）。
示例
输入：text1 = "abcde", text2 = "ace"
输出：3
Java实现（动态规划）
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        // dp[i][j]：text1前i个字符与text2前j个字符的LCS长度
        int[][] dp = new int[m+1][n+1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i-1) == text2.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }
        return dp[m][n];
    }
}

------------------

82. 删除排序链表中的重复元素 II（中等）
leetcode: https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/
题目描述
给定排序链表，删除所有重复出现的节点（只保留未重复的节点）。
示例
输入：head = [1,2,2,3]
输出：[1,3]
Java实现
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prev = dummy;
        while (prev.next != null) {
            ListNode curr = prev.next;
            // 判断当前节点是否重复
            boolean isDuplicate = false;
            while (curr.next != null && curr.val == curr.next.val) {
                curr = curr.next;
                isDuplicate = true;
            }
            if (isDuplicate) {
                // 跳过所有重复节点
                prev.next = curr.next;
            } else {
                // 无重复，移动prev
                prev = prev.next;
            }
        }
        return dummy.next;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

93. 复原IP地址（中等）
leetcode: https://leetcode.cn/problems/restore-ip-addresses/
题目描述
给定只含数字的字符串，复原为所有可能的有效IP地址（每段1-3位，值0-255，无前置零）。
示例
输入：s = "25525511135"
输出：["255.255.11.135","255.255.111.35"]
Java实现（回溯）
class Solution {
    public List<String> restoreIpAddresses(String s) {
        List<String> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), s, 0);
        return res;
    }

    private void backtrack(List<String> res, List<String> path, String s, int start) {
        // 已分4段且遍历完字符串
        if (path.size() == 4 && start == s.length()) {
            res.add(String.join(".", path));
            return;
        }
        // 已分4段但未遍历完，剪枝
        if (path.size() == 4) return;
        // 每段最多3位
        for (int i = start; i < Math.min(start + 3, s.length()); i++) {
            String segment = s.substring(start, i + 1);
            // 验证段的有效性
            if (isValid(segment)) {
                path.add(segment);
                backtrack(res, path, s, i + 1);
                path.remove(path.size() - 1);
            }
        }
    }

    private boolean isValid(String segment) {
        int len = segment.length();
        if (len == 0 || len > 3) return false;
        // 有前置零且长度>1
        if (len > 1 && segment.charAt(0) == '0') return false;
        // 值≤255
        return Integer.parseInt(segment) <= 255;
    }
}

------------------

19. 删除链表的倒数第N个节点（中等）
leetcode: https://leetcode.cn/problems/remove-nth-node-from-end-of-list/
题目描述
删除链表的倒数第n个节点，返回头节点。
示例
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
Java实现（快慢指针）
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode fast = dummy, slow = dummy;
        // 快指针先走n步
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }
        // 快慢指针同走，快到末尾时慢指针指向要删节点的前一个
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return dummy.next;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

142. 环形链表 II（中等）
leetcode: https://leetcode.cn/problems/linked-list-cycle-ii/
题目描述
找到环形链表的入口节点。
示例
输入：head = [3,2,0,-4], pos = 1（环入口为2）
输出：节点 2
Java实现（快慢指针）
public class Solution {
    public ListNode detectCycle(ListNode head) {
        if (head == null || head.next == null) return null;
        ListNode slow = head, fast = head;
        // 找相遇点
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) break;
        }
        // 无环
        if (fast == null || fast.next == null) return null;
        // 一个指针从起点，一个从相遇点，相遇即为入口
        fast = head;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }
        return slow;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) {
        val = x;
        next = null;
    }
}

------------------

4. 寻找两个正序数组的中位数（困难）
leetcode: https://leetcode.cn/problems/median-of-two-sorted-arrays/
题目描述
给定两个升序数组，找出它们的中位数（时间复杂度要求O(log(m+n))）。
示例
输入：nums1 = [1,3], nums2 = [2]
输出：2.0
Java实现（二分查找）
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length;
        // 确保nums1更短，减少二分次数
        if (m > n) return findMedianSortedArrays(nums2, nums1);
        int left = 0, right = m;
        int totalLeft = (m + n + 1) / 2; // 左半部分总长度

        while (left <= right) {
            int i = left + (right - left) / 2; // nums1的左半部分长度
            int j = totalLeft - i; // nums2的左半部分长度

            // 边界值处理
            int nums1LeftMax = (i == 0) ? Integer.MIN_VALUE : nums1[i-1];
            int nums1RightMin = (i == m) ? Integer.MAX_VALUE : nums1[i];
            int nums2LeftMax = (j == 0) ? Integer.MIN_VALUE : nums2[j-1];
            int nums2RightMin = (j == n) ? Integer.MAX_VALUE : nums2[j];

            if (nums1LeftMax <= nums2RightMin && nums2LeftMax <= nums1RightMin) {
                // 找到正确分割点
                if ((m + n) % 2 == 1) {
                    return Math.max(nums1LeftMax, nums2LeftMax);
                } else {
                    return (Math.max(nums1LeftMax, nums2LeftMax) + Math.min(nums1RightMin, nums2RightMin)) / 2.0;
                }
            } else if (nums1LeftMax > nums2RightMin) {
                right = i - 1;
            } else {
                left = i + 1;
            }
        }
        return 0.0;
    }
}

------------------

165. 比较版本号（中等）
leetcode: https://leetcode.cn/problems/compare-version-numbers/
题目描述
比较两个版本号version1和version2，返回：
- 1 若version1 > version2；
- -1 若version1 < version2；
- 0 若相等。
示例
输入：version1 = "1.01", version2 = "1.001"
输出：0
Java实现
class Solution {
    public int compareVersion(String version1, String version2) {
        String[] v1 = version1.split("\\.");
        String[] v2 = version2.split("\\.");
        int maxLen = Math.max(v1.length, v2.length);

        for (int i = 0; i < maxLen; i++) {
            int num1 = (i < v1.length) ? Integer.parseInt(v1[i]) : 0;
            int num2 = (i < v2.length) ? Integer.parseInt(v2[i]) : 0;
            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }
        return 0;
    }
}

------------------

199. 二叉树的右视图（中等）
leetcode: https://leetcode.cn/problems/binary-tree-right-side-view/
题目描述
给定二叉树，返回其右视图（从右侧看能看到的节点）。
示例
输入：root = [1,2,3,null,5,null,4]
输出：[1,3,4]
Java实现（层序遍历）
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                // 取每一层的最后一个节点
                if (i == size - 1) res.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
        }
        return res;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

22. 括号生成（中等）
leetcode: https://leetcode.cn/problems/generate-parentheses/
题目描述
数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
示例
示例 1：
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
示例 2：
输入：n = 1
输出：["()"]
具体实现
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        backtrack(res, new StringBuilder(), 0, 0, n);
        return res;
    }

    private void backtrack(List<String> res, StringBuilder sb, int open, int close, int max) {
        if (sb.length() == max * 2) {
            res.add(sb.toString());
            return;
        }
        if (open < max) {
            sb.append('(');
            backtrack(res, sb, open + 1, close, max);
            sb.deleteCharAt(sb.length() - 1);
        }
        if (close < open) {
            sb.append(')');
            backtrack(res, sb, open, close + 1, max);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}

------------------

232. 用栈实现队列（容易）
leetcode: https://leetcode.cn/problems/implement-queue-using-stacks/
题目描述
请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（push、pop、peek、empty）：
- void push(int x) 将元素 x 推到队列的末尾
- int pop() 从队列的开头移除并返回元素
- int peek() 返回队列开头的元素
- boolean empty() 如果队列为空，返回 true ；否则，返回 false
示例
输入：
["MyQueue", "push", "push", "peek", "pop", "empty"]
[[], [1], [2], [], [], []]
输出：
[null, null, null, 1, 1, false]
具体实现
class MyQueue {
    private Stack<Integer> inStack;
    private Stack<Integer> outStack;

    public MyQueue() {
        inStack = new Stack<>();
        outStack = new Stack<>();
    }
    
    public void push(int x) {
        inStack.push(x);
    }
    
    public int pop() {
        if (outStack.isEmpty()) transfer();
        return outStack.pop();
    }
    
    public int peek() {
        if (outStack.isEmpty()) transfer();
        return outStack.peek();
    }
    
    public boolean empty() {
        return inStack.isEmpty() && outStack.isEmpty();
    }

    private void transfer() {
        while (!inStack.isEmpty()) outStack.push(inStack.pop());
    }
}

------------------

704. 二分查找（容易）
leetcode: https://leetcode.cn/problems/binary-search/
题目描述
给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。
示例
示例 1：
输入: nums = [-1,0,3,5,9,12], target = 9
输出: 4
示例 2：
输入: nums = [-1,0,3,5,9,12], target = 2
输出: -1
具体实现
class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}

------------------

94. 二叉树的中序遍历（容易）
leetcode: https://leetcode.cn/problems/binary-tree-inorder-traversal/
题目描述
给定一个二叉树的根节点 root ，返回它的 中序 遍历。
示例
示例 1：
输入：root = [1,null,2,3]
输出：[1,3,2]
具体实现（迭代版）
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode curr = root;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            res.add(curr.val);
            curr = curr.right;
        }
        return res;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

239. 滑动窗口最大值（困难）
leetcode: https://leetcode.cn/problems/sliding-window-maximum/
题目描述
给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。返回滑动窗口中的最大值。
示例
输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
输出：[3,3,5,5,6,7]
具体实现
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        if (nums == null || nums.length == 0) return new int[0];
        int n = nums.length;
        int[] res = new int[n - k + 1];
        Deque<Integer> deque = new LinkedList<>();
        int idx = 0;

        for (int i = 0; i < n; i++) {
            // 移除窗口外的下标
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) deque.pollFirst();
            // 维护单调递减队列
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) deque.pollLast();
            deque.offerLast(i);
            // 记录最大值
            if (i >= k - 1) res[idx++] = nums[deque.peekFirst()];
        }
        return res;
    }
}

------------------

69. x 的平方根（容易）
leetcode: https://leetcode.cn/problems/sqrtx/
题目描述
给你一个非负整数 x ，计算并返回 x 的 算术平方根，结果只保留整数部分。
示例
示例 1：
输入：x = 4
输出：2
示例 2：
输入：x = 8
输出：2
具体实现
class Solution {
    public int mySqrt(int x) {
        if (x == 0 || x == 1) return x;
        int left = 1, right = x, res = 0;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (mid <= x / mid) {
                res = mid;
                left = mid + 1;
            } else right = mid - 1;
        }
        return res;
    }
}

------------------

148. 排序链表（中等）
leetcode: https://leetcode.cn/problems/sort-list/
题目描述
给你链表的头结点 head ，请将其按 升序 排列并返回排序后的链表。
示例
输入：head = [4,2,1,3]
输出：[1,2,3,4]
具体实现（归并排序）
class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        // 找中点
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode mid = slow.next;
        slow.next = null;
        // 分治排序
        ListNode left = sortList(head);
        ListNode right = sortList(mid);
        // 合并
        return merge(left, right);
    }

    private ListNode merge(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val < l2.val) {
                curr.next = l1;
                l1 = l1.next;
            } else {
                curr.next = l2;
                l2 = l2.next;
            }
            curr = curr.next;
        }
        curr.next = l1 != null ? l1 : l2;
        return dummy.next;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

32. 最长有效括号（困难）
leetcode: https://leetcode.cn/problems/longest-valid-parentheses/
题目描述
给你一个只包含 '(' 和 ')' 的字符串，找出最长有效括号子串的长度。
示例
示例 1：
输入：s = "(()"
输出：2
示例 2：
输入：s = ")()())"
输出：4
具体实现（栈）
class Solution {
    public int longestValidParentheses(String s) {
        Stack<Integer> stack = new Stack<>();
        stack.push(-1);
        int maxLen = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') stack.push(i);
            else {
                stack.pop();
                if (stack.isEmpty()) stack.push(i);
                else maxLen = Math.max(maxLen, i - stack.peek());
            }
        }
        return maxLen;
    }
}

------------------

31. 下一个排列（中等）
leetcode: https://leetcode.cn/problems/next-permutation/
题目描述
整数数组的 下一个排列 是指其字典序更大的排列；若不存在，则重排为升序排列。需原地修改。
示例
示例 1：
输入：nums = [1,2,3]
输出：[1,3,2]
示例 2：
输入：nums = [3,2,1]
输出：[1,2,3]
具体实现
class Solution {
    public void nextPermutation(int[] nums) {
        int n = nums.length;
        // 找第一个降序位置
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        // 交换更大的数
        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums, i, j);
        }
        // 反转后续部分
        reverse(nums, i + 1, n - 1);
    }

    private void swap(int[] nums, int a, int b) {
        int temp = nums[a];
        nums[a] = nums[b];
        nums[b] = temp;
    }

    private void reverse(int[] nums, int l, int r) {
        while (l < r) swap(nums, l++, r--);
    }
}

------------------

8. 字符串转换整数 (atoi)（中等）
leetcode: https://leetcode.cn/problems/string-to-integer-atoi/
题目描述
实现 myAtoi(string s) 函数，将字符串转换成32位有符号整数，需处理前导空格、符号、数字截断等逻辑。
示例
示例 1：
输入：s = "42"
输出：42
示例 2：
输入：s = "   -42"
输出：-42
具体实现
class Solution {
    public int myAtoi(String s) {
        int n = s.length(), idx = 0;
        // 跳过前导空格
        while (idx < n && s.charAt(idx) == ' ') idx++;
        if (idx == n) return 0;
        // 处理符号
        int sign = 1;
        if (s.charAt(idx) == '+' || s.charAt(idx) == '-') {
            sign = s.charAt(idx) == '+' ? 1 : -1;
            idx++;
        }
        // 转换数字
        int res = 0;
        while (idx < n && Character.isDigit(s.charAt(idx))) {
            int digit = s.charAt(idx) - '0';
            // 检查溢出
            if (res > Integer.MAX_VALUE / 10 || (res == Integer.MAX_VALUE / 10 && digit > 7)) {
                return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }
            res = res * 10 + digit;
            idx++;
        }
        return res * sign;
    }
}

------------------

2. 两数相加（中等）
leetcode: https://leetcode.cn/problems/add-two-numbers/
题目描述
给你两个逆序存储的非负整数链表，返回它们相加后的逆序链表（每个节点存一位数字）。
示例
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
具体实现
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) {
                sum += l1.val;
                l1 = l1.next;
            }
            if (l2 != null) {
                sum += l2.val;
                l2 = l2.next;
            }
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
        }
        return dummy.next;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

70. 爬楼梯（容易）
leetcode: https://leetcode.cn/problems/climbing-stairs/
题目描述
爬n阶楼梯，每次可以爬1或2个台阶，求不同的方法数。
示例
示例 1：
输入：n = 2
输出：2
示例 2：
输入：n = 3
输出：3
具体实现（滚动数组）
class Solution {
    public int climbStairs(int n) {
        if (n == 1) return 1;
        int prev1 = 1, prev2 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev1 = prev2;
            prev2 = curr;
        }
        return prev2;
    }
}

------------------

322. 零钱兑换（中等）
leetcode: https://leetcode.cn/problems/coin-change/
题目描述
给你硬币数组 coins 和总金额 amount，求凑成金额的最少硬币数；无法凑成则返回-1。
示例
输入：coins = [1, 2, 5], amount = 11
输出：3
具体实现（动态规划）
class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i >= coin && dp[i - coin] != Integer.MAX_VALUE) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }
}

------------------

43. 字符串相乘（中等）
leetcode: https://leetcode.cn/problems/multiply-strings/
题目描述
给定两个字符串表示的非负整数 num1 和 num2，返回它们的乘积字符串（不能转整数）。
示例
输入: num1 = "123", num2 = "456"
输出: "56088"
具体实现
class Solution {
    public String multiply(String num1, String num2) {
        if (num1.equals("0") || num2.equals("0")) return "0";
        int m = num1.length(), n = num2.length();
        int[] res = new int[m + n];
        // 模拟竖式乘法
        for (int i = m - 1; i >= 0; i--) {
            int d1 = num1.charAt(i) - '0';
            for (int j = n - 1; j >= 0; j--) {
                int d2 = num2.charAt(j) - '0';
                int product = d1 * d2;
                int sum = product + res[i + j + 1];
                res[i + j + 1] = sum % 10;
                res[i + j] += sum / 10;
            }
        }
        // 转字符串
        StringBuilder sb = new StringBuilder();
        for (int num : res) {
            if (sb.length() == 0 && num == 0) continue;
            sb.append(num);
        }
        return sb.toString();
    }
}

------------------

76. 最小覆盖子串（困难）
leetcode: https://leetcode.cn/problems/minimum-window-substring/
题目描述
给你字符串 s 和 t，返回 s 中涵盖 t 所有字符的最小子串；不存在则返回空串。
示例
输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"
具体实现（滑动窗口）
class Solution {
    public String minWindow(String s, String t) {
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) need.put(c, need.getOrDefault(c, 0) + 1);
        Map<Character, Integer> window = new HashMap<>();
        int left = 0, right = 0, valid = 0;
        int start = 0, len = Integer.MAX_VALUE;

        while (right < s.length()) {
            char c = s.charAt(right++);
            if (need.containsKey(c)) {
                window.put(c, window.getOrDefault(c, 0) + 1);
                if (window.get(c).equals(need.get(c))) valid++;
            }
            // 收缩窗口
            while (valid == need.size()) {
                if (right - left < len) {
                    start = left;
                    len = right - left;
                }
                char d = s.charAt(left++);
                if (need.containsKey(d)) {
                    if (window.get(d).equals(need.get(d))) valid--;
                    window.put(d, window.get(d) - 1);
                }
            }
        }
        return len == Integer.MAX_VALUE ? "" : s.substring(start, start + len);
    }
}

------------------

41. 缺失的第一个正数（困难）
leetcode: https://leetcode.cn/problems/first-missing-positive/
题目描述
给你未排序的整数数组 nums，找出其中没有出现的最小正整数；要求时间O(n)、空间O(1)。
示例
示例 1：
输入：nums = [1,2,0]
输出：3
示例 2：
输入：nums = [3,4,-1,1]
输出：2
具体实现（原地哈希）
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        // 数字i放到下标i-1的位置
        for (int i = 0; i < n; i++) {
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                swap(nums, i, nums[i] - 1);
            }
        }
        // 找第一个不匹配的位置
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) return i + 1;
        }
        return n + 1;
    }

    private void swap(int[] nums, int a, int b) {
        int temp = nums[a];
        nums[a] = nums[b];
        nums[b] = temp;
    }
}

------------------

105. 从前序与中序遍历序列构造二叉树（中等）
leetcode: https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
题目描述
给定先序遍历数组 preorder 和中序遍历数组 inorder，构造对应的二叉树并返回根节点。
示例
输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
输出: [3,9,20,null,null,15,7]
具体实现
class Solution {
    private Map<Integer, Integer> inMap;
    private int preIdx;

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        inMap = new HashMap<>();
        preIdx = 0;
        for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
        return build(preorder, 0, inorder.length - 1);
    }

    private TreeNode build(int[] pre, int left, int right) {
        if (left > right) return null;
        int rootVal = pre[preIdx++];
        TreeNode root = new TreeNode(rootVal);
        int mid = inMap.get(rootVal);
        root.left = build(pre, left, mid - 1);
        root.right = build(pre, mid + 1, right);
        return root;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

78. 子集（中等）
leetcode: https://leetcode.cn/problems/subsets/
题目描述
给你无重复元素的整数数组 nums，返回其所有可能的子集（幂集）。
示例
输入：nums = [1,2,3]
输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
具体实现（回溯）
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), nums, 0);
        return res;
    }

    private void backtrack(List<List<Integer>> res, List<Integer> curr, int[] nums, int start) {
        res.add(new ArrayList<>(curr));
        for (int i = start; i < nums.length; i++) {
            curr.add(nums[i]);
            backtrack(res, curr, nums, i + 1);
            curr.remove(curr.size() - 1);
        }
    }
}

------------------

剑指 Offer 22. 链表中倒数第k个节点（容易）
leetcode: https://leetcode.cn/problems/jian-zhi-offer-22/
题目描述
输入一个链表，输出该链表中倒数第k个节点（从1开始计数）。
示例
输入：链表: 1->2->3->4->5, k = 2
输出：4->5
具体实现（快慢指针）
class Solution {
    public ListNode getKthFromEnd(ListNode head, int k) {
        ListNode fast = head, slow = head;
        // 快指针先移k步
        for (int i = 0; i < k; i++) fast = fast.next;
        // 快慢指针同移
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        return slow;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

------------------

151. 反转字符串里的单词（中等）
leetcode: https://leetcode.cn/problems/reverse-string/
题目描述
给你字符串 s，翻转其中的单词顺序，且单词间仅用一个空格分隔，无多余空格。
示例
输入：s = "the sky is blue"
输出："blue is sky the"
具体实现
class Solution {
    public String reverseWords(String s) {
        // 去除多余空格
        StringBuilder sb = trimSpaces(s);
        // 翻转整个字符串
        reverse(sb, 0, sb.length() - 1);
        // 翻转每个单词
        reverseEachWord(sb);
        return sb.toString();
    }

    private StringBuilder trimSpaces(String s) {
        int l = 0, r = s.length() - 1;
        while (l <= r && s.charAt(l) == ' ') l++;
        while (l <= r && s.charAt(r) == ' ') r--;
        StringBuilder sb = new StringBuilder();
        while (l <= r) {
            char c = s.charAt(l);
            if (c != ' ') sb.append(c);
            else if (sb.charAt(sb.length() - 1) != ' ') sb.append(c);
            l++;
        }
        return sb;
    }

    private void reverse(StringBuilder sb, int l, int r) {
        while (l < r) {
            char temp = sb.charAt(l);
            sb.setCharAt(l++, sb.charAt(r));
            sb.setCharAt(r--, temp);
        }
    }

    private void reverseEachWord(StringBuilder sb) {
        int n = sb.length(), start = 0;
        while (start < n) {
            int end = start;
            while (end < n && sb.charAt(end) != ' ') end++;
            reverse(sb, start, end - 1);
            start = end + 1;
        }
    }
}

------------------

129. 求根到叶子节点数字之和（中等）
leetcode: https://leetcode.cn/problems/sum-root-to-leaf-numbers/
题目描述
给定二叉树的根节点 root，每个节点值为 0-9，求所有从根到叶子节点形成的数字之和（叶子节点是指没有子节点的节点）。
示例
输入：root = [1,2,3]
输出：25
解释：根到叶子节点 1→2 形成数字 12，1→3 形成 13，和为 12+13=25
具体实现
class Solution {
    public int sumNumbers(TreeNode root) {
        return dfs(root, 0);
    }

    private int dfs(TreeNode node, int prevSum) {
        if (node == null) return 0;
        int currSum = prevSum * 10 + node.val;
        // 叶子节点直接返回当前和
        if (node.left == null && node.right == null) {
            return currSum;
        }
        // 递归左右子树
        return dfs(node.left, currSum) + dfs(node.right, currSum);
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

155. 最小栈（容易）
leetcode: https://leetcode.cn/problems/min-stack/
题目描述
设计一个支持 push、pop、top 操作，并能在常数时间内检索到最小元素的栈。
示例
输入：
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]
输出：
[null,null,null,null,-3,null,0,-2]
具体实现
class MinStack {
    private Deque<Integer> dataStack;
    private Deque<Integer> minStack;

    public MinStack() {
        dataStack = new LinkedList<>();
        minStack = new LinkedList<>();
        // 初始化最小栈为无穷大，避免空栈判断
        minStack.push(Integer.MAX_VALUE);
    }
    
    public void push(int val) {
        dataStack.push(val);
        // 最小栈存当前最小值（当前值与栈顶较小者）
        minStack.push(Math.min(val, minStack.peek()));
    }
    
    public void pop() {
        dataStack.pop();
        minStack.pop();
    }
    
    public int top() {
        return dataStack.peek();
    }
    
    public int getMin() {
        return minStack.peek();
    }
}

------------------

34. 在排序数组中查找元素的第一个和最后一个位置（中等）
leetcode: https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/
题目描述
给定升序整数数组 nums 和目标值 target，找出 target 在数组中出现的第一个和最后一个位置；若不存在，返回 [-1, -1]。
示例
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
具体实现（二分查找）
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int left = findLeft(nums, target);
        int right = findRight(nums, target);
        return new int[]{left, right};
    }

    // 找左边界
    private int findLeft(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        int res = -1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) {
                res = mid;
                r = mid - 1; // 继续向左找
            } else if (nums[mid] < target) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        return res;
    }

    // 找右边界
    private int findRight(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        int res = -1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) {
                res = mid;
                l = mid + 1; // 继续向右找
            } else if (nums[mid] < target) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        return res;
    }
}

------------------

394. 字符串解码（中等）
leetcode: https://leetcode.cn/problems/decode-string/
题目描述
给定编码字符串（如 3[a]2[bc]），返回解码后的字符串（如 aaabcbc）。编码规则：k[encoded_string] 表示重复 k 次 encoded_string。
示例
输入：s = "3[a]2[bc]"
输出："aaabcbc"
具体实现（栈）
class Solution {
    public String decodeString(String s) {
        Deque<String> strStack = new LinkedList<>();
        Deque<Integer> numStack = new LinkedList<>();
        StringBuilder currStr = new StringBuilder();
        int currNum = 0;

        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                currNum = currNum * 10 + (c - '0');
            } else if (c == '[') {
                // 保存当前字符串和数字
                strStack.push(currStr.toString());
                numStack.push(currNum);
                currStr = new StringBuilder();
                currNum = 0;
            } else if (c == ']') {
                // 弹出之前的字符串和数字，拼接
                int num = numStack.pop();
                String prevStr = strStack.pop();
                StringBuilder temp = new StringBuilder(prevStr);
                for (int i = 0; i < num; i++) {
                    temp.append(currStr);
                }
                currStr = temp;
            } else {
                currStr.append(c);
            }
        }
        return currStr.toString();
    }
}

------------------

101. 对称二叉树（容易）
leetcode: https://leetcode.cn/problems/symmetric-tree/
题目描述
给定二叉树的根节点 root，判断其是否是镜像对称的。
示例
输入：root = [1,2,2,3,4,4,3]
输出：true
具体实现（递归）
class Solution {
    public boolean isSymmetric(TreeNode root) {
        if (root == null) return true;
        return checkSymmetric(root.left, root.right);
    }

    private boolean checkSymmetric(TreeNode left, TreeNode right) {
        // 均为空则对称
        if (left == null && right == null) return true;
        // 一个为空一个不为空则不对称
        if (left == null || right == null) return false;
        // 节点值相等，且左的左和右的右对称、左的右和右的左对称
        return left.val == right.val 
            && checkSymmetric(left.left, right.right) 
            && checkSymmetric(left.right, right.left);
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

39. 组合总和（中等）
leetcode: https://leetcode.cn/problems/combination-sum/
题目描述
给定无重复元素的整数数组 candidates 和目标整数 target，找出所有和为 target 的元素组合（元素可重复选取）。
示例
输入：candidates = [2,3,6,7], target = 7
输出：[[2,2,3],[7]]
具体实现（回溯）
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), candidates, target, 0);
        return res;
    }

    private void backtrack(List<List<Integer>> res, List<Integer> curr, int[] candidates, int remain, int start) {
        if (remain < 0) return;
        // 剩余和为0，找到有效组合
        if (remain == 0) {
            res.add(new ArrayList<>(curr));
            return;
        }
        // 从start开始避免重复组合
        for (int i = start; i < candidates.length; i++) {
            curr.add(candidates[i]);
            backtrack(res, curr, candidates, remain - candidates[i], i);
            curr.remove(curr.size() - 1); // 回溯
        }
    }
}

------------------

470. 用 Rand7() 实现 Rand10()（中等）
leetcode: https://leetcode.cn/problems/implement-rand10-using-rand7/
题目描述
已有方法 Rand7() 可生成 1-7 的均匀随机整数，据此实现 Rand10() 生成 1-10 的均匀随机整数。
示例
输入：1
输出：（1-10的随机整数）
具体实现（拒绝采样）
class Solution extends SolBase {
    public int rand10() {
        int num;
        // 生成1-49的均匀随机数，取1-40（拒绝41-49）
        do {
            num = (rand7() - 1) * 7 + rand7(); // 等概率生成1-49
        } while (num > 40);
        // 1-40映射为1-10
        return num % 10 + 1;
    }
}

// 题目提供的基础类（无需实现）
class SolBase {
    public int rand7() {
        return (int) (Math.random() * 7) + 1;
    }
}

------------------

64. 最小路径和（中等）
leetcode: https://leetcode.cn/problems/minimum-path-sum/
题目描述
给定 m x n 的网格，每个格子含非负整数，找从左上角到右下角的最小路径和（只能向右或向下移动）。
示例
输入：grid = [[1,3,1],[1,5,1],[4,2,1]]
输出：7
解释：路径 1→3→1→1→1 的和最小
具体实现（动态规划）
class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        // 原地修改网格作为dp数组
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (i == 0 && j == 0) {
                    continue; // 起点不变
                } else if (i == 0) {
                    // 第一行只能从左边来
                    grid[i][j] += grid[i][j-1];
                } else if (j == 0) {
                    // 第一列只能从上面来
                    grid[i][j] += grid[i-1][j];
                } else {
                    // 取上方或左方的较小值
                    grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);
                }
            }
        }
        return grid[m-1][n-1];
    }
}

------------------

104. 二叉树的最大深度（容易）
leetcode: https://leetcode.cn/problems/maximum-depth-of-binary-tree/
题目描述
给定二叉树的根节点 root，返回其最大深度（根到最远叶子节点的最长路径上的节点数）。
示例
输入：root = [3,9,20,null,null,15,7]
输出：3
具体实现（递归）
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        // 左子树深度 + 右子树深度的较大值 + 当前节点
        int leftDepth = maxDepth(root.left);
        int rightDepth = maxDepth(root.right);
        return Math.max(leftDepth, rightDepth) + 1;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

110. 平衡二叉树（容易）
leetcode: https://leetcode.cn/problems/balanced-binary-tree/
题目描述
给定二叉树的根节点 root，判断其是否是高度平衡的二叉树（每个节点的左右子树高度差不超过 1）。
示例
输入：root = [3,9,20,null,null,15,7]
输出：true
具体实现（递归）
class Solution {
    public boolean isBalanced(TreeNode root) {
        return getHeight(root) != -1;
    }

    // 返回当前节点的高度，若不平衡则返回-1
    private int getHeight(TreeNode node) {
        if (node == null) return 0;
        int leftHeight = getHeight(node.left);
        if (leftHeight == -1) return -1;
        int rightHeight = getHeight(node.right);
        if (rightHeight == -1) return -1;
        // 高度差超过1则不平衡
        if (Math.abs(leftHeight - rightHeight) > 1) return -1;
        return Math.max(leftHeight, rightHeight) + 1;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

128. 最长连续序列（中等）
leetcode: https://leetcode.cn/problems/longest-consecutive-sequence/
题目描述
给定未排序的整数数组，找出最长连续元素序列的长度（要求时间复杂度 O(n)）。
示例
输入：nums = [100,4,200,1,3,2]
输出：4
解释：最长序列是 [1,2,3,4]
具体实现（哈希表）
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> numSet = new HashSet<>();
        for (int num : nums) numSet.add(num);
        int maxLen = 0;

        for (int num : numSet) {
            // 只有当num是序列起点（num-1不存在）时，才开始统计
            if (!numSet.contains(num - 1)) {
                int currNum = num;
                int currLen = 1;
                // 向后找连续的数
                while (numSet.contains(currNum + 1)) {
                    currNum++;
                    currLen++;
                }
                maxLen = Math.max(maxLen, currLen);
            }
        }
        return maxLen;
    }
}

------------------

144. 二叉树的前序遍历（容易）
leetcode: https://leetcode.cn/problems/binary-tree-preorder-traversal/
题目描述
给定二叉树的根节点 root，返回其前序遍历结果（根→左→右）。
示例
输入：root = [1,null,2,3]
输出：[1,2,3]
具体实现（迭代）
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> stack = new LinkedList<>();
        stack.push(root);

        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            res.add(node.val);
            // 先压右节点（栈后进先出，保证左节点先处理）
            if (node.right != null) stack.push(node.right);
            if (node.left != null) stack.push(node.left);
        }
        return res;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

48. 旋转图像（中等）
leetcode: https://leetcode.cn/problems/rotate-image/
题目描述
给定 n x n 的二维矩阵，原地将其顺时针旋转 90 度。
示例
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[[7,4,1],[8,5,2],[9,6,3]]
具体实现
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        // 1. 转置矩阵（行变列）
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        // 2. 反转每一行
        for (int i = 0; i < n; i++) {
            int left = 0, right = n - 1;
            while (left < right) {
                int temp = matrix[i][left];
                matrix[i][left] = matrix[i][right];
                matrix[i][right] = temp;
                left++;
                right--;
            }
        }
    }
}

------------------

234. 回文链表（容易）
leetcode: https://leetcode.cn/problems/palindrome-linked-list/
题目描述
给定单链表的头节点 head，判断其是否是回文链表。
示例
输入：head = [1,2,2,1]
输出：true
具体实现
class Solution {
    public boolean isPalindrome(ListNode head) {
        if (head == null || head.next == null) return true;
        // 1. 快慢指针找中点
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        // 2. 反转后半部分链表
        ListNode secondHalf = reverse(slow.next);
        // 3. 比较前半和后半
        ListNode p1 = head, p2 = secondHalf;
        boolean res = true;
        while (res && p2 != null) {
            if (p1.val != p2.val) res = false;
            p1 = p1.next;
            p2 = p2.next;
        }
        // （可选）恢复链表
        slow.next = reverse(secondHalf);
        return res;
    }

    private ListNode reverse(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

695. 岛屿的最大面积（中等）
leetcode: https://leetcode.cn/problems/max-area-of-island/
题目描述
给定二维网格 grid，1 代表陆地，0 代表水，求最大岛屿面积（连通的 1 的个数，连通指上下左右相邻）。
示例
输入：grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0]]
输出：6
具体实现（DFS）
class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        int maxArea = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    // 计算当前岛屿面积
                    int area = dfs(grid, i, j);
                    maxArea = Math.max(maxArea, area);
                }
            }
        }
        return maxArea;
    }

    private int dfs(int[][] grid, int i, int j) {
        int m = grid.length;
        int n = grid[0].length;
        // 越界或不是陆地，返回0
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == 0) {
            return 0;
        }
        // 标记为已访问（置为0）
        grid[i][j] = 0;
        // 上下左右递归
        return 1 + dfs(grid, i-1, j) + dfs(grid, i+1, j) + dfs(grid, i, j-1) + dfs(grid, i, j+1);
    }
}

------------------

122. 买卖股票的最佳时机 II（容易）
leetcode: https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/
题目描述
给定股票价格数组，可多次买卖（买卖无间隔），求最大利润。
示例
输入：prices = [7,1,5,3,6,4]
输出：7
解释：买入1，卖出5（赚4）；买入3，卖出6（赚3），总利润7
具体实现
class Solution {
    public int maxProfit(int[] prices) {
        int profit = 0;
        // 只要后一天价格高于前一天，就累加差价
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i-1]) {
                profit += prices[i] - prices[i-1];
            }
        }
        return profit;
    }
}

------------------

240. 搜索二维矩阵 II（中等）
leetcode: https://leetcode.cn/problems/search-a-2d-matrix-ii/
题目描述
给定 m x n 矩阵，每行升序、每列升序，判断目标值是否存在。
示例
输入：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22]], target = 5
输出：true
具体实现
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length;
        int n = matrix[0].length;
        // 从右上角开始搜索
        int i = 0, j = n - 1;
        while (i < m && j >= 0) {
            if (matrix[i][j] == target) {
                return true;
            } else if (matrix[i][j] > target) {
                // 目标更小，左移
                j--;
            } else {
                // 目标更大，下移
                i++;
            }
        }
        return false;
    }
}

------------------

221. 最大正方形（中等）
leetcode: https://leetcode.cn/problems/maximal-square/
题目描述
给定二维二进制矩阵，找最大的全1正方形，返回其面积。
示例
输入：matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"]]
输出：4（边长为2）
具体实现（动态规划）
class Solution {
    public int maximalSquare(char[][] matrix) {
        if (matrix == null || matrix.length == 0) return 0;
        int m = matrix.length;
        int n = matrix[0].length;
        int[][] dp = new int[m][n];
        int maxSide = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == '1') {
                    if (i == 0 || j == 0) {
                        dp[i][j] = 1; // 边界只能是1
                    } else {
                        // 当前边长 = 左上、上、左的最小边长 + 1
                        dp[i][j] = Math.min(Math.min(dp[i-1][j], dp[i][j-1]), dp[i-1][j-1]) + 1;
                    }
                    maxSide = Math.max(maxSide, dp[i][j]);
                }
            }
        }
        return maxSide * maxSide;
    }
}

------------------

14. 最长公共前缀（容易）
leetcode: https://leetcode.cn/problems/longest-common-prefix/
题目描述
给定字符串数组，找出其最长公共前缀；若不存在，返回空串。
示例
输入：strs = ["flower","flow","flight"]
输出："fl"
具体实现
class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        // 以第一个字符串为基准
        String prefix = strs[0];
        for (int i = 1; i < strs.length; i++) {
            // 缩短前缀直到当前字符串以prefix开头
            while (strs[i].indexOf(prefix) != 0) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }
}

------------------

98. 验证二叉搜索树（中等）
leetcode: https://leetcode.cn/problems/validate-binary-search-tree/
题目描述
给定二叉树的根节点 root，判断其是否是有效的二叉搜索树（左子树所有节点 < 根，右子树所有节点 > 根，且左右子树均为BST）。
示例
输入：root = [2,1,3]
输出：true
具体实现（递归+上下界）
class Solution {
    public boolean isValidBST(TreeNode root) {
        return checkBST(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean checkBST(TreeNode node, long lower, long upper) {
        if (node == null) return true;
        // 当前节点值必须在(lower, upper)范围内
        if (node.val <= lower || node.val >= upper) return false;
        // 左子树范围：(lower, 当前节点值)
        // 右子树范围：(当前节点值, upper)
        return checkBST(node.left, lower, node.val) && checkBST(node.right, node.val, upper);
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

543. 二叉树的直径（容易）
leetcode: https://leetcode.cn/problems/diameter-of-binary-tree/

题目描述
给定二叉树的根节点 root，返回其直径长度（任意两个节点路径的最长长度，路径长度为节点数减 1）。
示例
输入：root = [1,2,3,4,5]
输出：3
解释：最长路径是 4→2→1→3 或 5→2→1→3，长度为 3
Java实现
class Solution {
    private int maxDiameter = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        calculateDepth(root);
        return maxDiameter;
    }

    // 计算节点深度的同时更新直径
    private int calculateDepth(TreeNode node) {
        if (node == null) return 0;
        int leftDepth = calculateDepth(node.left);
        int rightDepth = calculateDepth(node.right);
        // 直径 = 左深度 + 右深度
        maxDiameter = Math.max(maxDiameter, leftDepth + rightDepth);
        return Math.max(leftDepth, rightDepth) + 1;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

162. 寻找峰值（中等）
leetcode: https://leetcode.cn/problems/find-peak-element/
题目描述
给定整数数组 nums，找出峰值元素（大于左右相邻元素的元素），返回其索引；数组可能有多个峰值，返回任意一个即可。
示例
输入：nums = [1,2,3,1]
输出：2
Java实现（二分查找）
class Solution {
    public int findPeakElement(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            // 若mid < mid+1，峰值在右侧
            if (nums[mid] < nums[mid + 1]) {
                left = mid + 1;
            } else {
                // 否则峰值在左侧（含mid）
                right = mid;
            }
        }
        return left;
    }
}

------------------

179. 最大数（中等）
leetcode: https://leetcode.cn/problems/largest-number/
题目描述
给定非负整数数组，将其元素拼接成最大的字符串。
示例
输入：nums = [10,2]
输出："210"
Java实现
class Solution {
    public String largestNumber(int[] nums) {
        // 转换为字符串数组
        String[] strs = new String[nums.length];
        for (int i = 0; i < nums.length; i++) {
            strs[i] = String.valueOf(nums[i]);
        }
        // 自定义排序：a+b > b+a 则a在前
        Arrays.sort(strs, (a, b) -> (b + a).compareTo(a + b));
        // 处理全0的情况
        if (strs[0].equals("0")) return "0";
        // 拼接结果
        StringBuilder sb = new StringBuilder();
        for (String s : strs) sb.append(s);
        return sb.toString();
    }
}

------------------

113. 路径总和 II（中等）
leetcode: https://leetcode.cn/problems/path-sum-ii/
题目描述
给定二叉树的根节点 root 和目标和 targetSum，找出所有从根到叶子节点路径和等于 targetSum 的路径。
示例
输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
输出：[[5,4,11,2],[5,8,4,5]]
Java实现（回溯）
class Solution {
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), root, targetSum);
        return res;
    }

    private void backtrack(List<List<Integer>> res, List<Integer> path, TreeNode node, int remain) {
        if (node == null) return;
        // 添加当前节点到路径
        path.add(node.val);
        remain -= node.val;
        // 叶子节点且和等于目标
        if (node.left == null && node.right == null && remain == 0) {
            res.add(new ArrayList<>(path));
        } else {
            // 递归左右子树
            backtrack(res, path, node.left, remain);
            backtrack(res, path, node.right, remain);
        }
        // 回溯：移除当前节点
        path.remove(path.size() - 1);
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

662. 二叉树最大宽度（中等）
leetcode: https://leetcode.cn/problems/maximum-width-of-binary-tree/
题目描述
给定二叉树的根节点 root，返回其最大宽度（每层最左和最右节点的索引差 + 1，索引按满二叉树规则编号）。
示例
输入：root = [1,3,2,5,3,null,9]
输出：4
解释：第3层（5,3,null,9）的宽度为 9-5+1=5？实际按示例输出为4（注意避免溢出）
Java实现（层序遍历+索引记录）
class Solution {
    public int widthOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        Queue<Pair<TreeNode, Long>> queue = new LinkedList<>();
        queue.offer(new Pair<>(root, 0L));
        int maxWidth = 0;

        while (!queue.isEmpty()) {
            int size = queue.size();
            long startIdx = queue.peek().getValue(); // 层起始索引
            for (int i = 0; i < size; i++) {
                Pair<TreeNode, Long> curr = queue.poll();
                TreeNode node = curr.getKey();
                long idx = curr.getValue();
                // 更新最大宽度
                if (i == size - 1) {
                    maxWidth = Math.max(maxWidth, (int) (idx - startIdx + 1));
                }
                // 子节点索引：左=2*idx+1，右=2*idx+2（用long避免溢出）
                if (node.left != null) queue.offer(new Pair<>(node.left, 2 * idx + 1));
                if (node.right != null) queue.offer(new Pair<>(node.right, 2 * idx + 2));
            }
        }
        return maxWidth;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

62. 不同路径（中等）
leetcode: https://leetcode.cn/problems/unique-paths/
题目描述
给定 m x n 的网格，从左上角到右下角只能向右或向下移动，求不同路径的数量。
示例
输入：m = 3, n = 7
输出：28
Java实现（动态规划）
class Solution {
    public int uniquePaths(int m, int n) {
        // dp[i][j] 表示到(i,j)的路径数
        int[][] dp = new int[m][n];
        // 第一行和第一列只有1种路径
        for (int i = 0; i < m; i++) dp[i][0] = 1;
        for (int j = 0; j < n; j++) dp[0][j] = 1;
        // 状态转移：dp[i][j] = 上路径 + 左路径
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
        return dp[m-1][n-1];
    }
}

------------------

560. 和为K的子数组（中等）
leetcode: https://leetcode.cn/problems/subarray-sum-equals-k/
题目描述
给定整数数组 nums 和整数 k，求连续子数组和为 k 的个数。
示例
输入：nums = [1,1,1], k = 2
输出：2
Java实现（前缀和+哈希表）
class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> prefixSumCount = new HashMap<>();
        prefixSumCount.put(0, 1); // 前缀和为0的情况出现1次
        int prefixSum = 0;
        int count = 0;

        for (int num : nums) {
            prefixSum += num;
            // 若前缀和 - k 存在，说明存在子数组和为k
            count += prefixSumCount.getOrDefault(prefixSum - k, 0);
            // 更新当前前缀和的出现次数
            prefixSumCount.put(prefixSum, prefixSumCount.getOrDefault(prefixSum, 0) + 1);
        }
        return count;
    }
}

------------------

198. 打家劫舍（中等）
leetcode: https://leetcode.cn/problems/house-robber/
题目描述
给定非负整数数组表示房屋金额，不能偷相邻房屋，求能偷到的最大金额。
示例
输入：[1,2,3,1]
输出：4
Java实现（动态规划）
class Solution {
    public int rob(int[] nums) {
        if (nums.length == 0) return 0;
        if (nums.length == 1) return nums[0];
        // dp[i] 表示前i个房屋的最大金额
        int[] dp = new int[nums.length];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);
        for (int i = 2; i < nums.length; i++) {
            // 选当前房屋：dp[i-2]+nums[i]；不选：dp[i-1]
            dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
        }
        return dp[nums.length - 1];
    }
}

------------------

152. 乘积最大子数组（中等）
leetcode: https://leetcode.cn/problems/maximum-product-subarray/
题目描述
给定整数数组，求连续子数组的最大乘积。
示例
输入：[2,3,-2,4]
输出：6
Java实现（动态规划）
class Solution {
    public int maxProduct(int[] nums) {
        if (nums.length == 0) return 0;
        int maxProd = nums[0];
        int currMax = nums[0]; // 当前最大乘积
        int currMin = nums[0]; // 当前最小乘积（负数相乘可能变大）

        for (int i = 1; i < nums.length; i++) {
            int temp = currMax;
            // 更新当前最大/最小乘积
            currMax = Math.max(nums[i], Math.max(currMax * nums[i], currMin * nums[i]));
            currMin = Math.min(nums[i], Math.min(temp * nums[i], currMin * nums[i]));
            // 更新全局最大
            maxProd = Math.max(maxProd, currMax);
        }
        return maxProd;
    }
}

------------------

112. 路径总和（容易）
leetcode: https://leetcode.cn/problems/path-sum/
题目描述
给定二叉树的根节点 root 和目标和 targetSum，判断是否存在从根到叶子节点的路径和等于 targetSum。
示例
输入：root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
输出：true
Java实现（递归）
class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) return false;
        // 叶子节点，判断剩余和是否等于当前节点值
        if (root.left == null && root.right == null) {
            return targetSum == root.val;
        }
        // 递归左右子树，剩余和 = targetSum - 当前节点值
        return hasPathSum(root.left, targetSum - root.val) 
            || hasPathSum(root.right, targetSum - root.val);
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

227. 基本计算器 II（中等）
leetcode: https://leetcode.cn/problems/basic-calculator-ii/
题目描述
实现一个基本计算器，计算包含 +、-、*、/ 的字符串表达式的值（无括号）。
示例
输入："3+2*2"
输出：7
Java实现（栈）
class Solution {
    public int calculate(String s) {
        Deque<Integer> stack = new LinkedList<>();
        int num = 0;
        char op = '+'; // 初始操作符为+

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            // 数字字符，拼接成数
            if (Character.isDigit(c)) {
                num = num * 10 + (c - '0');
            }
            // 操作符或最后一个字符，处理当前数
            if ((!Character.isDigit(c) && c != ' ') || i == s.length() - 1) {
                switch (op) {
                    case '+': stack.push(num); break;
                    case '-': stack.push(-num); break;
                    case '*': stack.push(stack.pop() * num); break;
                    case '/': stack.push(stack.pop() / num); break;
                }
                op = c; // 更新操作符
                num = 0; // 重置当前数
            }
        }
        // 累加栈中所有数
        int res = 0;
        while (!stack.isEmpty()) res += stack.pop();
        return res;
    }
}

------------------

83. 删除排序链表中的重复元素（容易）
leetcode: https://leetcode.cn/problems/remove-duplicates-from-sorted-list/
题目描述
给定排序链表，删除重复节点，每个元素只保留一个。
示例
输入：1->1->2
输出：1->2
Java实现
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        if (head == null) return null;
        ListNode curr = head;
        while (curr.next != null) {
            // 当前节点与下一个节点值相同，跳过下一个
            if (curr.val == curr.next.val) {
                curr.next = curr.next.next;
            } else {
                curr = curr.next;
            }
        }
        return head;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

226. 翻转二叉树（容易）
leetcode: https://leetcode.cn/problems/invert-binary-tree/
题目描述
翻转二叉树，交换每个节点的左右子树。
示例
输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]
Java实现（递归）
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        // 交换左右子树
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;
        // 递归翻转左右子树
        invertTree(root.left);
        invertTree(root.right);
        return root;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

209. 长度最小的子数组（中等）
leetcode: https://leetcode.cn/problems/minimum-size-subarray-sum/
题目描述
给定正整数数组和目标值 target，找出和≥target的最短连续子数组长度；若不存在返回 0。
示例
输入：target = 7, nums = [2,3,1,2,4,3]
输出：2
Java实现（滑动窗口）
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int n = nums.length;
        int minLen = Integer.MAX_VALUE;
        int left = 0;
        int sum = 0;

        for (int right = 0; right < n; right++) {
            sum += nums[right];
            // 窗口和≥target，尝试缩小左边界
            while (sum >= target) {
                minLen = Math.min(minLen, right - left + 1);
                sum -= nums[left];
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? 0 : minLen;
    }
}

------------------

169. 多数元素（容易）
leetcode: https://leetcode.cn/problems/majority-element/
题目描述
给定整数数组，找出出现次数大于 n/2的元素（保证存在）。
示例
输入：[3,2,3]
输出：3
Java实现（摩尔投票法）
class Solution {
    public int majorityElement(int[] nums) {
        int candidate = nums[0];
        int count = 1;

        for (int i = 1; i < nums.length; i++) {
            if (count == 0) {
                candidate = nums[i];
                count = 1;
            } else if (nums[i] == candidate) {
                count++;
            } else {
                count--;
            }
        }
        return candidate;
    }
}

------------------

24. 两两交换链表中的节点（中等）
leetcode: https://leetcode.cn/problems/swap-nodes-in-pairs/
题目描述
给定链表，两两交换相邻节点，返回交换后的头节点。
示例
输入：1->2->3->4
输出：2->1->4->3
Java实现（迭代）
class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prev = dummy;

        while (prev.next != null && prev.next.next != null) {
            ListNode node1 = prev.next;
            ListNode node2 = prev.next.next;
            // 交换节点
            node1.next = node2.next;
            node2.next = node1;
            prev.next = node2;
            // 移动前驱节点
            prev = node1;
        }
        return dummy.next;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

139. 单词拆分（中等）
leetcode: https://leetcode.cn/problems/word-break/
题目描述
给定字符串 s 和单词字典 wordDict，判断 s 是否能被拆分为字典中单词的组合（单词可重复使用）。
示例
输入：s = "leetcode", wordDict = ["leet","code"]
输出：true
Java实现（动态规划）
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true; // 空字符串可拆分

        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                // 前j个字符可拆分，且j到i的子串在字典中
                if (dp[j] && wordSet.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];
    }
}

------------------

283. 移动零（容易）
leetcode: https://leetcode.cn/problems/move-zeroes/
题目描述
将数组中的所有0移到末尾，保持非零元素的相对顺序。
示例
输入：[0,1,0,3,12]
输出：[1,3,12,0,0]
Java实现（双指针）
class Solution {
    public void moveZeroes(int[] nums) {
        int slow = 0; // 记录非零元素的位置
        // 快指针遍历数组，非零则交换到slow位置
        for (int fast = 0; fast < nums.length; fast++) {
            if (nums[fast] != 0) {
                int temp = nums[slow];
                nums[slow] = nums[fast];
                nums[fast] = temp;
                slow++;
            }
        }
    }
}

------------------

718. 最长重复子数组（中等）
leetcode: https://leetcode.cn/problems/maximum-length-of-repeated-subarray/
题目描述
给定两个整数数组 nums1 和 nums2，找出最长公共连续子数组的长度。
示例
输入：nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
输出：3
Java实现（动态规划）
class Solution {
    public int findLength(int[] nums1, int[] nums2) {
        int m = nums1.length;
        int n = nums2.length;
        int maxLen = 0;
        // dp[i][j] 表示以nums1[i-1]和nums2[j-1]结尾的最长公共子数组长度
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (nums1[i-1] == nums2[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                    maxLen = Math.max(maxLen, dp[i][j]);
                }
            }
        }
        return maxLen;
    }
}

------------------

补充题6. 手撕堆排序（中等）
题目描述
实现堆排序算法，将数组升序排列（基于最大堆实现）。
核心步骤
1. 构建最大堆（从最后一个非叶子节点向上调整）；
2. 逐个将堆顶元素（最大值）移到数组末尾，调整剩余元素为最大堆。
Java实现
class Solution {
    public void heapSort(int[] arr) {
        int n = arr.length;
        // 1. 构建最大堆（从最后一个非叶子节点开始）
        for (int i = n / 2 - 1; i >= 0; i--) {
            adjustHeap(arr, n, i);
        }
        // 2. 逐个提取堆顶元素
        for (int i = n - 1; i > 0; i--) {
            // 堆顶（最大值）移到当前末尾
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            // 调整剩余元素为最大堆
            adjustHeap(arr, i, 0);
        }
    }

    // 调整以i为根的子树为最大堆
    private void adjustHeap(int[] arr, int heapSize, int i) {
        int largest = i; // 根节点
        int left = 2 * i + 1; // 左子节点
        int right = 2 * i + 2; // 右子节点

        // 左子节点更大
        if (left < heapSize && arr[left] > arr[largest]) {
            largest = left;
        }
        // 右子节点更大
        if (right < heapSize && arr[right] > arr[largest]) {
            largest = right;
        }
        // 若根不是最大，交换并继续调整
        if (largest != i) {
            int temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;
            adjustHeap(arr, heapSize, largest);
        }
    }
}

------------------

739. 每日温度（中等）
leetcode: https://leetcode.cn/problems/daily-temperatures/
题目描述
给定整数数组 temperatures，返回一个数组 answer，其中 answer[i] 是第 i 天之后首次出现更高温度的天数；若不存在则为 0。
示例
输入：temperatures = [73,74,75,71,69,72,76,73]
输出：[1,1,4,2,1,1,0,0]
Java实现（单调栈）
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] res = new int[n];
        Deque<Integer> stack = new LinkedList<>(); // 存索引，维护递减栈

        for (int i = 0; i < n; i++) {
            // 当前温度 > 栈顶索引对应的温度，计算天数
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int idx = stack.pop();
                res[idx] = i - idx;
            }
            stack.push(i);
        }
        return res;
    }
}

------------------

468. 验证IP地址（中等）
leetcode: https://leetcode.cn/problems/validate-ip-address/
题目描述
验证输入字符串是否是有效的 IPv4 或 IPv6 地址：
- IPv4：4个十进制数（0-255），用.分隔，无前置零（除非是0本身）。
- IPv6：8个16进制数（1-4位，含数字、a-f、A-F），用:分隔。
- 均不满足则返回 "Neither"。
示例
输入：queryIP = "172.16.254.1"
输出："IPv4"

输入：queryIP = "2001:0db8:85a3:0:0:8A2E:0370:7334"
输出："IPv6"
Java实现
class Solution {
    public String validIPAddress(String queryIP) {
        if (queryIP.contains(".")) {
            // 验证IPv4
            String[] parts = queryIP.split("\\.", -1); // -1避免忽略末尾空串
            if (parts.length != 4) return "Neither";
            for (String part : parts) {
                if (part.length() == 0 || part.length() > 3) return "Neither";
                if (part.charAt(0) == '0' && part.length() > 1) return "Neither";
                for (char c : part.toCharArray()) {
                    if (!Character.isDigit(c)) return "Neither";
                }
                if (Integer.parseInt(part) > 255) return "Neither";
            }
            return "IPv4";
        } else if (queryIP.contains(":")) {
            // 验证IPv6
            String[] parts = queryIP.split(":", -1);
            if (parts.length != 8) return "Neither";
            String hexChars = "0123456789abcdefABCDEF";
            for (String part : parts) {
                if (part.length() == 0 || part.length() > 4) return "Neither";
                for (char c : part.toCharArray()) {
                    if (hexChars.indexOf(c) == -1) return "Neither";
                }
            }
            return "IPv6";
        }
        return "Neither";
    }
}

------------------

138. 复制带随机指针的链表（中等）
leetcode: https://leetcode.cn/problems/copy-list-with-random-pointer/
题目描述
给定链表，每个节点包含 val、next 指针和 random 指针（指向任意节点或 null），深拷贝该链表。
示例
输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]
Java实现（哈希表映射）
class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;
        Map<Node, Node> map = new HashMap<>(); // 原节点 → 新节点

        // 第一步：复制节点值
        Node curr = head;
        while (curr != null) {
            map.put(curr, new Node(curr.val));
            curr = curr.next;
        }

        // 第二步：复制next和random指针
        curr = head;
        while (curr != null) {
            map.get(curr).next = map.get(curr.next);
            map.get(curr).random = map.get(curr.random);
            curr = curr.next;
        }
        return map.get(head);
    }
}

class Node {
    int val;
    Node next;
    Node random;
    public Node(int val) {
        this.val = val;
        this.next = null;
        this.random = null;
    }
}

------------------

79. 单词搜索（中等）
leetcode: https://leetcode.cn/problems/word-search/
题目描述
给定二维字符网格 board 和字符串 word，判断 word 是否存在于网格中（路径为相邻单元格，每个单元格仅用一次）。
示例
输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
输出：true
Java实现（回溯）
class Solution {
    private int[][] dirs = {{-1,0}, {1,0}, {0,-1}, {0,1}};
    private boolean[][] visited;
    private int m, n;

    public boolean exist(char[][] board, String word) {
        m = board.length;
        n = board[0].length;
        visited = new boolean[m][n];

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (backtrack(board, word, i, j, 0)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean backtrack(char[][] board, String word, int i, int j, int idx) {
        // 匹配完所有字符
        if (idx == word.length()) return true;
        // 越界、已访问、字符不匹配
        if (i < 0 || i >= m || j < 0 || j >= n || visited[i][j] || board[i][j] != word.charAt(idx)) {
            return false;
        }

        visited[i][j] = true;
        // 遍历四个方向
        for (int[] dir : dirs) {
            if (backtrack(board, word, i + dir[0], j + dir[1], idx + 1)) {
                return true;
            }
        }
        visited[i][j] = false; // 回溯
        return false;
    }
}

------------------

207. 课程表（中等）
leetcode: https://leetcode.cn/problems/course-schedule/
题目描述
给定课程数 numCourses 和先修依赖数组 prerequisites（[a,b] 表示修 a 需先修 b），判断是否能完成所有课程。
示例
输入：numCourses = 2, prerequisites = [[1,0]]
输出：true

输入：numCourses = 2, prerequisites = [[1,0],[0,1]]
输出：false
Java实现（拓扑排序）
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>(); // 邻接表
        int[] inDegree = new int[numCourses]; // 入度数组

        // 初始化邻接表
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        // 构建图
        for (int[] p : prerequisites) {
            int course = p[0];
            int pre = p[1];
            adj.get(pre).add(course);
            inDegree[course]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        // 入度为0的课程入队
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) queue.offer(i);
        }

        int count = 0;
        while (!queue.isEmpty()) {
            int curr = queue.poll();
            count++;
            // 遍历后续课程，入度减1
            for (int next : adj.get(curr)) {
                inDegree[next]--;
                if (inDegree[next] == 0) queue.offer(next);
            }
        }
        // 完成的课程数等于总课程数则无环
        return count == numCourses;
    }
}

------------------

297. 二叉树的序列化与反序列化（困难）
leetcode: https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/
题目描述
实现二叉树的序列化（转字符串）和反序列化（转二叉树），格式自定义。
示例
输入：root = [1,2,3,null,null,4,5]
序列化结果："1,2,3,null,null,4,5"
反序列化结果：恢复原二叉树
Java实现（层序遍历）
public class Codec {
    // 序列化：层序遍历
    public String serialize(TreeNode root) {
        if (root == null) return "";
        StringBuilder sb = new StringBuilder();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) {
                sb.append("null,");
            } else {
                sb.append(node.val).append(",");
                queue.offer(node.left);
                queue.offer(node.right);
            }
        }
        sb.deleteCharAt(sb.length() - 1); // 移除最后一个逗号
        return sb.toString();
    }

    // 反序列化：解析层序字符串
    public TreeNode deserialize(String data) {
        if (data.isEmpty()) return null;
        String[] parts = data.split(",");
        Queue<TreeNode> queue = new LinkedList<>();
        TreeNode root = new TreeNode(Integer.parseInt(parts[0]));
        queue.offer(root);
        int idx = 1;

        while (!queue.isEmpty() && idx < parts.length) {
            TreeNode curr = queue.poll();
            // 左节点
            if (!parts[idx].equals("null")) {
                curr.left = new TreeNode(Integer.parseInt(parts[idx]));
                queue.offer(curr.left);
            }
            idx++;
            // 右节点
            if (idx < parts.length && !parts[idx].equals("null")) {
                curr.right = new TreeNode(Integer.parseInt(parts[idx]));
                queue.offer(curr.right);
            }
            idx++;
        }
        return root;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

------------------

153. 寻找旋转排序数组中的最小值（中等）
leetcode: https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/
题目描述
升序数组旋转后（如 [0,1,2,4,5,6,7] → [4,5,6,7,0,1,2]），找出其中的最小值。
示例
输入：nums = [3,4,5,1,2]
输出：1
Java实现（二分查找）
class Solution {
    public int findMin(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) {
                // 最小值在右侧
                left = mid + 1;
            } else {
                // 最小值在左侧（含mid）
                right = mid;
            }
        }
        return nums[left];
    }
}

------------------

47. 全排列 II（中等）
leetcode: https://leetcode.cn/problems/permutations-ii/
题目描述
给定含重复元素的数组，返回所有不重复的全排列。
示例
输入：nums = [1,1,2]
输出：[[1,1,2],[1,2,1],[2,1,1]]
Java实现（回溯+去重）
class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums); // 排序便于去重
        backtrack(res, new ArrayList<>(), nums, new boolean[nums.length]);
        return res;
    }

    private void backtrack(List<List<Integer>> res, List<Integer> path, int[] nums, boolean[] used) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            // 已使用过 或 同一层重复元素（前一个未使用说明是同一层）
            if (used[i] || (i > 0 && nums[i] == nums[i-1] && !used[i-1])) {
                continue;
            }
            used[i] = true;
            path.add(nums[i]);
            backtrack(res, path, nums, used);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}

------------------

460. LFU缓存（困难）
leetcode: https://leetcode.cn/problems/lfu-cache/
题目描述
实现 LFU（最不经常使用）缓存：
- get(key)：获取值，不存在返回-1；访问后频率+1。
- put(key, value)：插入/更新值；容量满时移除频率最低的键（频率相同则移除最早访问的）。
示例
输入：
["LFUCache","put","put","get","put","get","get","put","get","get","get"]
[[2],[1,1],[2,2],[1],[3,3],[2],[3],[4,4],[1],[3],[4]]
输出：
[null,null,null,1,null,-1,3,null,-1,3,4]
Java实现
class LFUCache {
    // key → Node（存值、频率）
    private Map<Integer, Node> keyMap;
    // 频率 → 双向链表（存该频率的Node，保持访问顺序）
    private Map<Integer, DoubleLinkedList> freqMap;
    private int capacity;
    private int minFreq; // 当前最小频率

    public LFUCache(int capacity) {
        this.capacity = capacity;
        keyMap = new HashMap<>();
        freqMap = new HashMap<>();
        minFreq = 0;
    }
    
    public int get(int key) {
        if (!keyMap.containsKey(key)) return -1;
        Node node = keyMap.get(key);
        updateFreq(node);
        return node.value;
    }
    
    public void put(int key, int value) {
        if (capacity == 0) return;
        if (keyMap.containsKey(key)) {
            Node node = keyMap.get(key);
            node.value = value;
            updateFreq(node);
            return;
        }
        // 容量已满，移除频率最低的节点
        if (keyMap.size() == capacity) {
            DoubleLinkedList list = freqMap.get(minFreq);
            Node removeNode = list.removeLast();
            keyMap.remove(removeNode.key);
        }
        // 插入新节点
        Node newNode = new Node(key, value, 1);
        keyMap.put(key, newNode);
        freqMap.computeIfAbsent(1, k -> new DoubleLinkedList()).addFirst(newNode);
        minFreq = 1;
    }

    // 更新节点频率
    private void updateFreq(Node node) {
        int oldFreq = node.freq;
        DoubleLinkedList oldList = freqMap.get(oldFreq);
        oldList.remove(node);
        // 若旧频率链表为空且是minFreq，minFreq+1
        if (oldList.isEmpty() && oldFreq == minFreq) {
            minFreq++;
        }
        // 加入新频率链表
        node.freq++;
        freqMap.computeIfAbsent(node.freq, k -> new DoubleLinkedList()).addFirst(node);
    }

    // 双向链表节点
    private class Node {
        int key;
        int value;
        int freq;
        Node prev;
        Node next;
        public Node(int key, int value, int freq) {
            this.key = key;
            this.value = value;
            this.freq = freq;
        }
    }

    // 双向链表（维护同一频率的节点顺序）
    private class DoubleLinkedList {
        Node head;
        Node tail;
        public DoubleLinkedList() {
            head = new Node(-1, -1, 0);
            tail = new Node(-1, -1, 0);
            head.next = tail;
            tail.prev = head;
        }

        // 头部添加（最新访问）
        public void addFirst(Node node) {
            node.next = head.next;
            node.prev = head;
            head.next.prev = node;
            head.next = node;
        }

        // 移除节点
        public void remove(Node node) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }

        // 移除尾部（最早访问）
        public Node removeLast() {
            Node node = tail.prev;
            remove(node);
            return node;
        }

        // 判断是否为空
        public boolean isEmpty() {
            return head.next == tail;
        }
    }
}

------------------

224. 基本计算器（困难）
leetcode: https://leetcode.cn/problems/basic-calculator/
题目描述
实现包含 +、-、(、) 的字符串表达式计算（无乘除）。
示例
输入：s = "(1+(4+5+2)-3)+(6+8)"
输出：23
Java实现（栈）
class Solution {
    public int calculate(String s) {
        Deque<Integer> stack = new LinkedList<>();
        int res = 0;
        int num = 0;
        int sign = 1; // 当前符号（+1/-1）

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) {
                num = num * 10 + (c - '0');
            } else if (c == '+') {
                res += sign * num;
                num = 0;
                sign = 1;
            } else if (c == '-') {
                res += sign * num;
                num = 0;
                sign = -1;
            } else if (c == '(') {
                // 入栈：当前结果、当前符号
                stack.push(res);
                stack.push(sign);
                res = 0;
                sign = 1;
            } else if (c == ')') {
                res += sign * num;
                num = 0;
                // 出栈：符号、之前的结果
                res *= stack.pop();
                res += stack.pop();
            }
        }
        // 处理最后一个数
        res += sign * num;
        return res;
    }
}

------------------

402. 移掉K位数字（中等）
leetcode: https://leetcode.cn/problems/remove-k-digits/
题目描述
给定数字字符串 num 和整数 k，移除 k 个字符后得到最小的可能数字（无前置零）。
示例
输入：num = "1432219", k = 3
输出："1219"
Java实现（单调栈）
class Solution {
    public String removeKdigits(String num, int k) {
        Deque<Character> stack = new LinkedList<>();
        // 维护递增栈，移除较大的字符
        for (char c : num.toCharArray()) {
            while (k > 0 && !stack.isEmpty() && stack.peek() > c) {
                stack.pop();
                k--;
            }
            stack.push(c);
        }
        // 剩余k个字符，移除栈顶（较大的）
        while (k > 0 && !stack.isEmpty()) {
            stack.pop();
            k--;
        }
        // 拼接结果，处理前置零
        StringBuilder sb = new StringBuilder();
        boolean leadingZero = true;
        while (!stack.isEmpty()) {
            char c = stack.pollLast(); // 从栈底取（保持顺序）
            if (leadingZero && c == '0') continue;
            leadingZero = false;
            sb.append(c);
        }
        // 空串则返回"0"
        return sb.length() == 0 ? "0" : sb.toString();
    }
}

------------------

40. 组合总和 II（中等）
leetcode: https://leetcode.cn/problems/combination-sum-ii/
题目描述
给定含重复元素的数组，每个元素仅用一次，找出所有和为 target 的不重复组合。
示例
输入：candidates = [10,1,2,7,6,1,5], target = 8
输出：[[1,1,6],[1,2,5],[1,7],[2,6]]
Java实现（回溯+去重）
class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(candidates); // 排序便于去重
        backtrack(res, new ArrayList<>(), candidates, target, 0);
        return res;
    }

    private void backtrack(List<List<Integer>> res, List<Integer> path, int[] candidates, int remain, int start) {
        if (remain < 0) return;
        if (remain == 0) {
            res.add(new ArrayList<>(path));
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            // 同一层重复元素跳过
            if (i > start && candidates[i] == candidates[i-1]) continue;
            path.add(candidates[i]);
            backtrack(res, path, candidates, remain - candidates[i], i + 1); // i+1避免重复使用
            path.remove(path.size() - 1);
        }
    }
}

------------------

55. 跳跃游戏（中等）
leetcode: https://leetcode.cn/problems/jump-game/
题目描述
给定非负整数数组，每个元素表示最大跳跃长度，判断能否从索引0跳到最后一个索引。
示例
输入：nums = [2,3,1,1,4]
输出：true

输入：nums = [3,2,1,0,4]
输出：false
Java实现（贪心）
class Solution {
    public boolean canJump(int[] nums) {
        int maxReach = 0; // 最远可达索引
        for (int i = 0; i < nums.length; i++) {
            // 当前索引超过最远可达，无法跳跃
            if (i > maxReach) return false;
            // 更新最远可达
            maxReach = Math.max(maxReach, i + nums[i]);
            // 已可达最后一个索引
            if (maxReach >= nums.length - 1) return true;
        }
        return true;
    }
}

------------------

11. 盛最多水的容器（中等）
leetcode: https://leetcode.cn/problems/container-with-most-water/
题目描述
给定整数数组 height，表示柱子高度，找出两个柱子形成的容器能装的最大水量（面积 = min(高1, 高2) * 距离）。
示例
输入：height = [1,8,6,2,5,4,8,3,7]
输出：49
Java实现（双指针）
class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxArea = 0;
        while (left < right) {
            // 计算当前面积
            int currArea = Math.min(height[left], height[right]) * (right - left);
            maxArea = Math.max(maxArea, currArea);
            // 移动较矮的柱子（更可能找到更大面积）
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
}

------------------

123. 买卖股票的最佳时机 III（困难）
leetcode: https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/
题目描述
最多完成两次交易，求买卖股票的最大利润。
示例
输入：prices = [3,3,5,0,0,3,1,4]
输出：6（买0卖3，买1卖4）
Java实现（动态规划）
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length == 0) return 0;
        // 四个状态：第一次买、第一次卖、第二次买、第二次卖
        int buy1 = -prices[0], sell1 = 0;
        int buy2 = -prices[0], sell2 = 0;

        for (int i = 1; i < prices.length; i++) {
            buy1 = Math.max(buy1, -prices[i]);
            sell1 = Math.max(sell1, buy1 + prices[i]);
            buy2 = Math.max(buy2, sell1 - prices[i]);
            sell2 = Math.max(sell2, buy2 + prices[i]);
        }
        return sell2;
    }
}

------------------

补充题5. 手撕归并排序（中等）
题目描述
实现归并排序（分治思想），将数组升序排列。
核心步骤
1. 分：将数组分成两半，递归排序子数组；
2. 合：合并两个有序子数组为一个有序数组。
Java实现
class Solution {
    public void mergeSort(int[] arr) {
        if (arr.length <= 1) return;
        int mid = arr.length / 2;
        int[] left = new int[mid];
        int[] right = new int[arr.length - mid];
        // 拆分数组
        System.arraycopy(arr, 0, left, 0, mid);
        System.arraycopy(arr, mid, right, 0, arr.length - mid);
        // 递归排序
        mergeSort(left);
        mergeSort(right);
        // 合并有序数组
        merge(arr, left, right);
    }

    private void merge(int[] arr, int[] left, int[] right) {
        int i = 0, j = 0, k = 0;
        // 比较并合并
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                arr[k++] = left[i++];
            } else {
                arr[k++] = right[j++];
            }
        }
        // 合并剩余元素
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }
}

------------------

136. 只出现一次的数字（容易）
leetcode: https://leetcode.cn/problems/single-number/
题目描述
数组中除一个元素出现一次外，其余均出现两次，找出该元素。
示例
输入：nums = [2,2,1]
输出：1
Java实现（异或运算）
class Solution {
    public int singleNumber(int[] nums) {
        int res = 0;
        // 异或：a^a=0，a^0=a
        for (int num : nums) res ^= num;
        return res;
    }
}

------------------

61. 旋转链表（中等）
leetcode: https://leetcode.cn/problems/rotate-list/
题目描述
将链表向右旋转 k 个位置。
示例
输入：head = [1,2,3,4,5], k = 2
输出：[4,5,1,2,3]
Java实现
class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null || k == 0) return head;
        // 找链表长度
        int len = 1;
        ListNode tail = head;
        while (tail.next != null) {
            tail = tail.next;
            len++;
        }
        k %= len; // 取模避免重复旋转
        if (k == 0) return head;

        // 找到倒数第k+1个节点
        ListNode curr = head;
        for (int i = 0; i < len - k - 1; i++) {
            curr = curr.next;
        }
        // 旋转
        ListNode newHead = curr.next;
        curr.next = null;
        tail.next = head;
        return newHead;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

16. 最接近的三数之和（中等）
leetcode: https://leetcode.cn/problems/3sum-closest/
题目描述
给定数组，找出三个数的和最接近目标值 target，返回该和。
示例
输入：nums = [-1,2,1,-4], target = 1
输出：2（-1+2+1=2）
Java实现（排序+双指针）
class Solution {
    public int threeSumClosest(int[] nums, int target) {
        Arrays.sort(nums);
        int n = nums.length;
        int closestSum = nums[0] + nums[1] + nums[2];
        int minDiff = Math.abs(closestSum - target);

        for (int i = 0; i < n - 2; i++) {
            int left = i + 1, right = n - 1;
            while (left < right) {
                int currSum = nums[i] + nums[left] + nums[right];
                int currDiff = Math.abs(currSum - target);
                // 更新最接近和
                if (currDiff < minDiff) {
                    minDiff = currDiff;
                    closestSum = currSum;
                }
                // 调整指针
                if (currSum < target) {
                    left++;
                } else if (currSum > target) {
                    right--;
                } else {
                    return target; // 完全匹配
                }
            }
        }
        return closestSum;
    }
}

------------------

958. 二叉树的完全性检验（中等）
leetcode: https://leetcode.cn/problems/check-completeness-of-a-binary-tree/
题目描述
判断二叉树是否是完全二叉树（除最后一层外全满，最后一层节点左对齐）。
示例
输入：root = [1,2,3,4,5,6]
输出：true

输入：root = [1,2,3,4,5,null,7]
输出：false
Java实现（层序遍历）
class Solution {
    public boolean isCompleteTree(TreeNode root) {
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        boolean hasNull = false; // 是否遇到过null节点

        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) {
                hasNull = true;
            } else {
                // 遇到null后还有非null节点，不是完全二叉树
                if (hasNull) return false;
                queue.offer(node.left);
                queue.offer(node.right);
            }
        }
        return true;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

剑指 Offer 51. 数组中的逆序对（困难）
leetcode: https://leetcode.cn/problems/jian-zhi-offer-51/
题目描述
在数组中，若前面数字大于后面数字，则构成一个逆序对。输入数组，求逆序对的总数。
示例
输入：[7,5,6,4]
输出：5
Java实现（归并排序）
class Solution {
    private int count = 0;

    public int reversePairs(int[] nums) {
        if (nums.length < 2) return 0;
        mergeSort(nums, 0, nums.length - 1);
        return count;
    }

    private void mergeSort(int[] nums, int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        mergeSort(nums, left, mid);
        mergeSort(nums, mid + 1, right);
        merge(nums, left, mid, right);
    }

    private void merge(int[] nums, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;
        // 统计逆序对：左半部分元素 > 右半部分元素
        while (i <= mid && j <= right) {
            if (nums[i] <= nums[j]) {
                temp[k++] = nums[i++];
            } else {
                count += mid - i + 1; // 左半部分剩余元素均与当前j构成逆序对
                temp[k++] = nums[j++];
            }
        }
        // 合并剩余元素
        while (i <= mid) temp[k++] = nums[i++];
        while (j <= right) temp[k++] = nums[j++];
        System.arraycopy(temp, 0, nums, left, temp.length);
    }
}

------------------

498. 对角线遍历（中等）
leetcode: https://leetcode.cn/problems/diagonal-traverse/
题目描述
给定 m x n 矩阵，按对角线遍历顺序返回所有元素（方向交替：右上→左下→右上…）。
示例
输入：mat = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,4,7,5,3,6,8,9]
Java实现
class Solution {
    public int[] findDiagonalOrder(int[][] mat) {
        if (mat == null || mat.length == 0) return new int[0];
        int m = mat.length, n = mat[0].length;
        int[] res = new int[m * n];
        int idx = 0;
        int row = 0, col = 0;
        boolean up = true; // 标记当前方向（右上/左下）

        while (idx < m * n) {
            res[idx++] = mat[row][col];
            if (up) {
                // 右上方向：行-1，列+1
                if (col == n - 1) { // 到达右边界，换行
                    row++;
                    up = false;
                } else if (row == 0) { // 到达上边界，换列
                    col++;
                    up = false;
                } else {
                    row--;
                    col++;
                }
            } else {
                // 左下方向：行+1，列-1
                if (row == m - 1) { // 到达下边界，换列
                    col++;
                    up = true;
                } else if (col == 0) { // 到达左边界，换行
                    row++;
                    up = true;
                } else {
                    row++;
                    col--;
                }
            }
        }
        return res;
    }
}

------------------

剑指 Offer 09. 用两个栈实现队列（容易）
leetcode: https://leetcode.cn/problems/jian-zhi-offer-09/
题目描述
用两个栈实现队列的 appendTail（入队）和 deleteHead（出队）操作，队列遵循先进先出规则。
示例
输入：
["CQueue","appendTail","deleteHead","deleteHead"]
[[],[3],[],[]]
输出：[null,null,3,-1]
Java实现
class CQueue {
    private Deque<Integer> inStack;
    private Deque<Integer> outStack;

    public CQueue() {
        inStack = new LinkedList<>();
        outStack = new LinkedList<>();
    }
    
    public void appendTail(int value) {
        inStack.push(value);
    }
    
    public int deleteHead() {
        // 若出栈为空，将入栈元素倒出
        if (outStack.isEmpty()) {
            while (!inStack.isEmpty()) {
                outStack.push(inStack.pop());
            }
        }
        return outStack.isEmpty() ? -1 : outStack.pop();
    }
}

------------------

26. 删除排序数组中的重复项（容易）
leetcode: https://leetcode.cn/problems/sort-an-array/
题目描述
给定升序数组，原地删除重复元素，使每个元素仅出现一次，返回新长度。
示例
输入：nums = [1,1,2]
输出：2（数组变为 [1,2]）
Java实现（双指针）
class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        int slow = 0; // 记录不重复元素的位置
        for (int fast = 1; fast < nums.length; fast++) {
            if (nums[fast] != nums[slow]) {
                slow++;
                nums[slow] = nums[fast];
            }
        }
        return slow + 1;
    }
}

------------------

518. 零钱兑换 II（中等）
leetcode: https://leetcode.cn/problems/coin-change-ii/
题目描述
给定硬币数组 coins 和总金额 amount，求凑成金额的硬币组合数（硬币可重复选取，组合顺序不计）。
示例
输入：amount = 5, coins = [1,2,5]
输出：4（组合：1+1+1+1+1、1+1+1+2、1+2+2、5）
Java实现（动态规划）
class Solution {
    public int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1];
        dp[0] = 1; // 凑成0的组合数为1
        // 遍历硬币（避免重复组合）
        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] += dp[i - coin];
            }
        }
        return dp[amount];
    }
}

------------------

剑指 Offer 36. 二叉搜索树与双向链表（中等）
leetcode: https://leetcode.cn/problems/jian-zhi-offer-36/
题目描述
将二叉搜索树转换为排序的循环双向链表（仅调整节点指针，不创建新节点）。
示例
输入：二叉搜索树 [4,2,5,1,3]
输出：排序双向链表 1<->2<->3<->4<->5（首尾相连）
Java实现（中序遍历）
class Solution {
    private Node pre, head;

    public Node treeToDoublyList(Node root) {
        if (root == null) return null;
        dfs(root);
        // 连接首尾节点，形成循环
        head.left = pre;
        pre.right = head;
        return head;
    }

    private void dfs(Node curr) {
        if (curr == null) return;
        dfs(curr.left);
        // 调整指针：前驱节点的right指向当前，当前的left指向前驱
        if (pre == null) {
            head = curr; // 第一个节点作为头
        } else {
            pre.right = curr;
            curr.left = pre;
        }
        pre = curr; // 更新前驱节点
        dfs(curr.right);
    }
}

class Node {
    public int val;
    public Node left;
    public Node right;
    public Node() {}
    public Node(int _val) { val = _val; }
    public Node(int _val,Node _left,Node _right) {
        val = _val; left = _left; right = _right;
    }
}

------------------

补充题1. 排序奇升偶降链表（中等）
题目描述
链表中奇数位节点升序、偶数位节点降序，将其排序为整体升序的链表。
示例
输入：1->8->3->6->5->4->7->2
输出：1->2->3->4->5->6->7->8
Java实现
class Solution {
    public ListNode sortOddEvenList(ListNode head) {
        if (head == null) return null;
        // 1. 拆分奇偶链表
        ListNode oddHead = head, evenHead = head.next;
        ListNode odd = oddHead, even = evenHead;
        while (even != null && even.next != null) {
            odd.next = even.next;
            odd = odd.next;
            even.next = odd.next;
            even = even.next;
        }
        odd.next = null; // 断开奇数链表尾部

        // 2. 反转偶链表（使其升序）
        evenHead = reverse(evenHead);

        // 3. 合并两个升序链表
        return merge(oddHead, evenHead);
    }

    // 反转链表
    private ListNode reverse(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    // 合并两个升序链表
    private ListNode merge(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val < l2.val) {
                curr.next = l1;
                l1 = l1.next;
            } else {
                curr.next = l2;
                l2 = l2.next;
            }
            curr = curr.next;
        }
        curr.next = l1 != null ? l1 : l2;
        return dummy.next;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

74. 搜索二维矩阵（中等）
leetcode: https://leetcode.cn/problems/search-a-2d-matrix/
题目描述
给定 m x n 矩阵（每行升序、每列升序），判断目标值是否存在。
示例
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
输出：true
Java实现（二分查找）
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int left = 0, right = m * n - 1;
        // 视为一维升序数组进行二分
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int row = mid / n, col = mid % n;
            if (matrix[row][col] == target) {
                return true;
            } else if (matrix[row][col] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return false;
    }
}

------------------

7. 整数反转（容易）
leetcode: https://leetcode.cn/problems/reverse-integer/
题目描述
反转32位有符号整数的数字部分，若结果溢出则返回0。
示例
输入：123 → 输出：321
输入：-123 → 输出：-321
输入：120 → 输出：21
Java实现
class Solution {
    public int reverse(int x) {
        long res = 0;
        while (x != 0) {
            res = res * 10 + x % 10;
            x /= 10;
            // 溢出判断
            if (res > Integer.MAX_VALUE || res < Integer.MIN_VALUE) {
                return 0;
            }
        }
        return (int) res;
    }
}

------------------

补充题23. 检测循环依赖（中等）
题目描述
给定项目依赖关系（如 A依赖B），检测是否存在循环依赖（如 A→B→C→A）。
示例
输入：依赖关系 [[A,B], [B,C], [C,A]]
输出：存在循环依赖
Java实现（拓扑排序）
class Solution {
    public boolean hasCycleDependency(List<List<String>> dependencies) {
        // 1. 构建邻接表和入度表
        Map<String, List<String>> adj = new HashMap<>();
        Map<String, Integer> inDegree = new HashMap<>();
        Set<String> nodes = new HashSet<>();

        for (List<String> dep : dependencies) {
            String from = dep.get(1), to = dep.get(0); // A依赖B → B→A
            adj.computeIfAbsent(from, k -> new ArrayList<>()).add(to);
            inDegree.put(to, inDegree.getOrDefault(to, 0) + 1);
            nodes.add(from);
            nodes.add(to);
        }

        // 2. 拓扑排序
        Queue<String> queue = new LinkedList<>();
        for (String node : nodes) {
            if (!inDegree.containsKey(node) || inDegree.get(node) == 0) {
                queue.offer(node);
            }
        }

        int count = 0;
        while (!queue.isEmpty()) {
            String curr = queue.poll();
            count++;
            if (adj.containsKey(curr)) {
                for (String next : adj.get(curr)) {
                    inDegree.put(next, inDegree.get(next) - 1);
                    if (inDegree.get(next) == 0) {
                        queue.offer(next);
                    }
                }
            }
        }
        // 完成拓扑的节点数 < 总节点数 → 存在环
        return count != nodes.size();
    }
}

------------------

剑指 Offer 26. 树的子结构（中等）
leetcode: https://leetcode.cn/problems/jian-zhi-offer-26/
题目描述
判断二叉树B是否是二叉树A的子结构（B的结构和节点值需与A的某部分完全匹配）。
示例
输入：A = [3,4,5,1,2], B = [4,1]
输出：true
Java实现
class Solution {
    public boolean isSubStructure(TreeNode A, TreeNode B) {
        // 空树不是任何树的子结构
        if (A == null || B == null) return false;
        // 检查A的当前节点、左子树、右子树是否包含B
        return check(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B);
    }

    // 检查以A为根的树是否包含以B为根的子结构
    private boolean check(TreeNode A, TreeNode B) {
        if (B == null) return true; // B已匹配完成
        if (A == null || A.val != B.val) return false; // A为空或值不匹配
        // 递归检查左右子树
        return check(A.left, B.left) && check(A.right, B.right);
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

------------------

114. 二叉树展开为链表（中等）
leetcode: https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/
题目描述
将二叉树展开为单链表（右指针指向下一节点，左指针为null），顺序与前序遍历一致。
示例
输入：root = [1,2,5,3,4,null,6]
输出：1->2->3->4->5->6
Java实现（原地调整）
class Solution {
    public void flatten(TreeNode root) {
        TreeNode curr = root;
        while (curr != null) {
            if (curr.left != null) {
                // 找到左子树的最右节点
                TreeNode rightmost = curr.left;
                while (rightmost.right != null) {
                    rightmost = rightmost.right;
                }
                // 左子树的最右节点连接到当前节点的右子树
                rightmost.right = curr.right;
                // 当前节点的右指针指向左子树
                curr.right = curr.left;
                curr.left = null; // 左指针置空
            }
            // 移动到下一个节点
            curr = curr.right;
        }
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

75. 颜色分类（中等）
leetcode: https://leetcode.cn/problems/sort-colors/
题目描述
给定包含0、1、2的数组，原地排序为 [0,0,...,1,1,...,2,2]（荷兰国旗问题）。
示例
输入：[2,0,2,1,1,0]
输出：[0,0,1,1,2,2]
Java实现（双指针）
class Solution {
    public void sortColors(int[] nums) {
        int left = 0; // 0的右边界
        int right = nums.length - 1; // 2的左边界
        int curr = 0;
        while (curr <= right) {
            if (nums[curr] == 0) {
                // 交换到左边界，left和curr右移
                swap(nums, curr++, left++);
            } else if (nums[curr] == 2) {
                // 交换到右边界，right左移（curr不右移，需重新检查交换后的值）
                swap(nums, curr, right--);
            } else {
                // 1直接跳过
                curr++;
            }
        }
    }

    private void swap(int[] nums, int a, int b) {
        int temp = nums[a];
        nums[a] = nums[b];
        nums[b] = temp;
    }
}

------------------

91. 解码方法（中等）
leetcode: https://leetcode.cn/problems/decode-ways/
题目描述
数字串按 1→A, 2→B,…,26→Z 编码，求解码方法的总数。
示例
输入："12" → 输出：2（1+2、12）
输入："226" → 输出：3（2+2+6、2+26、22+6）
Java实现（动态规划）
class Solution {
    public int numDecodings(String s) {
        int n = s.length();
        int[] dp = new int[n + 1];
        dp[0] = 1; // 空串的解码数为1
        dp[1] = s.charAt(0) == '0' ? 0 : 1; // 首字符为0则无法解码

        for (int i = 2; i <= n; i++) {
            // 单个字符解码（1-9）
            int oneDigit = Integer.parseInt(s.substring(i-1, i));
            if (oneDigit >= 1 && oneDigit <= 9) {
                dp[i] += dp[i-1];
            }
            // 两个字符解码（10-26）
            int twoDigits = Integer.parseInt(s.substring(i-2, i));
            if (twoDigits >= 10 && twoDigits <= 26) {
                dp[i] += dp[i-2];
            }
        }
        return dp[n];
    }
}

------------------

125. 验证回文串（容易）
leetcode: https://leetcode.cn/problems/valid-palindrome/
题目描述
验证字符串是否为回文串（仅考虑字母/数字，忽略大小写）。
示例
输入："A man, a plan, a canal: Panama" → 输出：true
输入："race a car" → 输出：false
Java实现（双指针）
class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            // 跳过非字母/数字字符
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            // 转换为小写比较
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}

------------------

50. Pow(x, n)（中等）
leetcode: https://leetcode.cn/problems/powx-n/
题目描述
实现 pow(x, n)，计算x的n次幂（n为整数）。
示例
输入：x=2.0, n=10 → 输出：1024.0
输入：x=2.0, n=-2 → 输出：0.25
Java实现（快速幂）
class Solution {
    public double myPow(double x, int n) {
        // 处理n为负数的情况，用long避免溢出
        long exp = n;
        if (exp < 0) {
            x = 1 / x;
            exp = -exp;
        }
        double res = 1.0;
        while (exp > 0) {
            // 若当前位为1，乘入结果
            if (exp % 2 == 1) {
                res *= x;
            }
            // 底数平方，指数右移
            x *= x;
            exp /= 2;
        }
        return res;
    }
}

------------------

572. 另一个树的子树（容易）
leetcode: https://leetcode.cn/problems/subtree-of-another-tree/
题目描述
判断二叉树 subRoot 是否是 root 的子树（结构和节点值完全匹配）。
示例
输入：root = [3,4,5,1,2], subRoot = [4,1,2]
输出：true
Java实现
class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        if (root == null) return false;
        // 检查当前节点、左子树、右子树是否与subRoot相等
        return isSameTree(root, subRoot) 
            || isSubtree(root.left, subRoot) 
            || isSubtree(root.right, subRoot);
    }

    // 判断两棵树是否完全相等
    private boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        return p.val == q.val 
            && isSameTree(p.left, q.left) 
            && isSameTree(p.right, q.right);
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

145. 二叉树的后序遍历（中等）
leetcode: https://leetcode.cn/problems/binary-tree-postorder-traversal/
题目描述
返回二叉树的后序遍历结果（左→右→根）。
示例
输入：root = [1,null,2,3]
输出：[3,2,1]
Java实现（迭代）
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> stack = new LinkedList<>();
        TreeNode prev = null; // 记录上一个访问的节点
        TreeNode curr = root;

        while (curr != null || !stack.isEmpty()) {
            // 遍历左子树
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.peek();
            // 右子树为空或已访问，访问当前节点
            if (curr.right == null || curr.right == prev) {
                res.add(curr.val);
                stack.pop();
                prev = curr;
                curr = null; // 避免重复遍历
            } else {
                // 遍历右子树
                curr = curr.right;
            }
        }
        return res;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

59. 螺旋矩阵 II（中等）
leetcode: https://leetcode.cn/problems/spiral-matrix-ii/
题目描述
生成 n x n 矩阵，元素按顺时针螺旋排列（1到n²）。
示例
输入：n=3
输出：[[1,2,3],[8,9,4],[7,6,5]]
Java实现
class Solution {
    public int[][] generateMatrix(int n) {
        int[][] matrix = new int[n][n];
        int top = 0, bottom = n - 1;
        int left = 0, right = n - 1;
        int num = 1;

        while (num <= n * n) {
            // 上边界：从左到右
            for (int i = left; i <= right; i++) {
                matrix[top][i] = num++;
            }
            top++;
            // 右边界：从上到下
            for (int i = top; i <= bottom; i++) {
                matrix[i][right] = num++;
            }
            right--;
            // 下边界：从右到左
            for (int i = right; i >= left; i--) {
                matrix[bottom][i] = num++;
            }
            bottom--;
            // 左边界：从下到上
            for (int i = bottom; i >= top; i--) {
                matrix[i][left] = num++;
            }
            left++;
        }
        return matrix;
    }
}

------------------

440. 字典序的第K小数字（困难）
leetcode: https://leetcode.cn/problems/k-th-smallest-in-lexicographical-order/
题目描述
给定 n 和 k，返回 [1, n] 中字典序第k小的数（字典序：1→10→11→…→19→2→…）。
示例
输入：n=13, k=2
输出：10
Java实现
class Solution {
    public int findKthNumber(int n, int k) {
        int curr = 1;
        k--; // 第1小是1，k减为0时返回

        while (k > 0) {
            // 计算以curr为前缀的数字个数
            long count = countNumbers(curr, n);
            if (count > k) {
                // 第k小在当前前缀下，进入下一层
                curr *= 10;
                k--;
            } else {
                // 第k小不在当前前缀下，切换到下一个前缀
                k -= count;
                curr++;
            }
        }
        return curr;
    }

    // 计算以prefix为前缀且≤n的数字个数
    private long countNumbers(long prefix, int n) {
        long count = 0;
        long start = prefix;
        long end = prefix;
        while (start <= n) {
            // 取end和n的较小值
            count += Math.min(end, n) - start + 1;
            // 扩大前缀范围
            start *= 10;
            end = end * 10 + 9;
        }
        return count;
    }
}

------------------

135. 分发糖果（困难）
leetcode: https://leetcode.cn/problems/candy/
题目描述
n个孩子站成一排，每个孩子有评分。分发糖果规则：
1. 每个孩子至少1颗；
2. 相邻孩子中评分高的得到更多糖果。
求最少需要的糖果数。
示例
输入：[1,0,2]
输出：5（分配：2,1,2）
Java实现
class Solution {
    public int candy(int[] ratings) {
        int n = ratings.length;
        int[] candies = new int[n];
        // 左→右：确保右高的比左多
        for (int i = 0; i < n; i++) {
            if (i > 0 && ratings[i] > ratings[i-1]) {
                candies[i] = candies[i-1] + 1;
            } else {
                candies[i] = 1;
            }
        }
        // 右→左：确保左高的比右多
        int res = 0;
        for (int i = n-1; i >= 0; i--) {
            if (i < n-1 && ratings[i] > ratings[i+1]) {
                candies[i] = Math.max(candies[i], candies[i+1] + 1);
            }
            res += candies[i];
        }
        return res;
    }
}

------------------

329. 矩阵中的最长递增路径（困难）
leetcode: https://leetcode.cn/problems/longest-increasing-path-in-a-matrix/
题目描述
给定m×n矩阵，找出最长递增路径的长度（路径可上下左右移动，元素严格递增）。
示例
输入：matrix = [[9,9,4],[6,6,8],[2,1,1]]
输出：4（路径：1→2→6→9）
Java实现（记忆化DFS）
class Solution {
    private int[][] dirs = {{-1,0}, {1,0}, {0,-1}, {0,1}};
    private int m, n;

    public int longestIncreasingPath(int[][] matrix) {
        if (matrix == null || matrix.length == 0) return 0;
        m = matrix.length;
        n = matrix[0].length;
        int[][] memo = new int[m][n]; // 记忆化存储每个点的最长路径
        int maxLen = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                maxLen = Math.max(maxLen, dfs(matrix, i, j, memo));
            }
        }
        return maxLen;
    }

    private int dfs(int[][] matrix, int i, int j, int[][] memo) {
        if (memo[i][j] != 0) return memo[i][j];
        int len = 1; // 至少包含自身
        for (int[] dir : dirs) {
            int x = i + dir[0], y = j + dir[1];
            if (x >= 0 && x < m && y >=0 && y < n && matrix[x][y] > matrix[i][j]) {
                len = Math.max(len, 1 + dfs(matrix, x, y, memo));
            }
        }
        memo[i][j] = len;
        return len;
    }
}

------------------

442. 数组中重复的数据（中等）
leetcode: https://leetcode.cn/problems/find-all-duplicates-in-an-array/
题目描述
数组元素为[1, n]，每个元素出现1或2次，找出所有出现2次的元素（要求空间复杂度O(1)）。
示例
输入：[4,3,2,7,8,2,3,1]
输出：[2,3]
Java实现（正负标记法）
class Solution {
    public List<Integer> findDuplicates(int[] nums) {
        List<Integer> res = new ArrayList<>();
        for (int num : nums) {
            int idx = Math.abs(num) - 1; // 元素对应索引（1→0）
            if (nums[idx] < 0) {
                res.add(Math.abs(num)); // 已标记过，说明重复
            } else {
                nums[idx] = -nums[idx]; // 标记为已访问
            }
        }
        return res;
    }
}

------------------

剑指 Offer 40. 最小的k个数（容易）
leetcode: https://leetcode.cn/problems/jian-zhi-offer-40/
题目描述
输入整数数组，找出其中最小的k个数（无需排序）。
示例
输入：arr = [3,2,1], k = 2
输出：[1,2]
Java实现（快速选择）
class Solution {
    public int[] getLeastNumbers(int[] arr, int k) {
        if (k == 0) return new int[0];
        quickSelect(arr, 0, arr.length - 1, k - 1); // 找第k-1小的数
        return Arrays.copyOf(arr, k);
    }

    // 找到第target小的数（升序）
    private void quickSelect(int[] arr, int left, int right, int target) {
        int pivot = partition(arr, left, right);
        if (pivot == target) return;
        else if (pivot > target) quickSelect(arr, left, pivot - 1, target);
        else quickSelect(arr, pivot + 1, right, target);
    }

    private int partition(int[] arr, int left, int right) {
        int pivot = arr[right];
        int i = left;
        for (int j = left; j < right; j++) {
            if (arr[j] <= pivot) {
                swap(arr, i++, j);
            }
        }
        swap(arr, i, right);
        return i;
    }

    private void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
}

------------------

剑指 Offer 54. 二叉搜索树的第k大节点（容易）
leetcode: https://leetcode.cn/problems/jian-zhi-offer-54/
题目描述
给定二叉搜索树，找出其第k大的节点（BST中序遍历为升序，逆中序为降序）。
示例
输入：root = [3,1,4,null,2], k = 1
输出：4
Java实现
class Solution {
    private int res, k;

    public int kthLargest(TreeNode root, int k) {
        this.k = k;
        dfs(root);
        return res;
    }

    // 逆中序遍历：右→根→左
    private void dfs(TreeNode node) {
        if (node == null) return;
        dfs(node.right);
        if (k == 0) return; // 已找到，提前返回
        if (--k == 0) res = node.val;
        dfs(node.left);
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

------------------

剑指 Offer 42. 连续子数组的最大和（容易）
leetcode: https://leetcode.cn/problems/jian-zhi-offer-42/
题目描述
输入整数数组，找出连续子数组的最大和。
示例
输入：[-2,1,-3,4,-1,2,1,-5,4]
输出：6（子数组[4,-1,2,1]）
Java实现（动态规划）
class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            // 当前子数组和：要么接前面，要么重新开始
            currSum = Math.max(nums[i], currSum + nums[i]);
            maxSum = Math.max(maxSum, currSum);
        }
        return maxSum;
    }
}

------------------

450. 删除二叉搜索树中的节点（中等）
leetcode: https://leetcode.cn/problems/delete-node-in-a-bst/
题目描述
给定二叉搜索树的根节点和值key，删除值为key的节点，保持BST性质。
示例
输入：root = [5,3,6,2,4,null,7], key = 3
输出：[5,4,6,2,null,null,7]（或[5,2,6,null,4,null,7]）
Java实现
class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;
        if (root.val > key) {
            root.left = deleteNode(root.left, key);
        } else if (root.val < key) {
            root.right = deleteNode(root.right, key);
        } else {
            // 情况1：无左子树
            if (root.left == null) return root.right;
            // 情况2：无右子树
            if (root.right == null) return root.left;
            // 情况3：有左右子树，找右子树最小节点
            TreeNode minNode = findMin(root.right);
            root.val = minNode.val;
            root.right = deleteNode(root.right, minNode.val);
        }
        return root;
    }

    // 找BST最小节点（最左）
    private TreeNode findMin(TreeNode node) {
        while (node.left != null) node = node.left;
        return node;
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

------------------

10. 正则表达式匹配（困难）
leetcode: https://leetcode.cn/problems/regular-expression-matching/
题目描述
实现正则表达式的匹配，支持.（匹配任意单个字符）和*（匹配0或多个前一个字符）。
示例
输入：s = "aa", p = "a*"
输出：true
Java实现（动态规划）
class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length(), n = p.length();
        // dp[i][j]：s前i个字符与p前j个字符是否匹配
        boolean[][] dp = new boolean[m+1][n+1];
        dp[0][0] = true; // 空串匹配空串

        // 处理p以*开头的情况（如"a*"匹配空串）
        for (int j = 2; j <= n; j++) {
            if (p.charAt(j-1) == '*') {
                dp[0][j] = dp[0][j-2];
            }
        }

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                char sc = s.charAt(i-1), pc = p.charAt(j-1);
                if (sc == pc || pc == '.') {
                    dp[i][j] = dp[i-1][j-1];
                } else if (pc == '*') {
                    // *匹配0个前字符
                    dp[i][j] = dp[i][j-2];
                    // *匹配多个前字符（前字符匹配当前s字符）
                    char prePc = p.charAt(j-2);
                    if (prePc == sc || prePc == '.') {
                        dp[i][j] |= dp[i-1][j];
                    }
                }
            }
        }
        return dp[m][n];
    }
}

------------------

剑指 Offer 10- II. 青蛙跳台阶问题（容易）
题目描述
青蛙一次可跳1或2级台阶，求跳上n级台阶的方法数（结果模1e9+7）。
示例
输入：n = 2
输出：2
Java实现
class Solution {
    public int numWays(int n) {
        if (n == 0 || n == 1) return 1;
        int prev1 = 1, prev2 = 1;
        for (int i = 2; i <= n; i++) {
            int curr = (prev1 + prev2) % 1000000007;
            prev1 = prev2;
            prev2 = curr;
        }
        return prev2;
    }
}

------------------

208. 实现 Trie (前缀树)（中等）
leetcode: https://leetcode.cn/problems/implement-trie-prefix-tree/
题目描述
实现前缀树的insert、search、startsWith方法：
- insert(word)：插入单词；
- search(word)：判断单词是否存在；
- startsWith(prefix)：判断是否存在以prefix开头的单词。
示例
输入：
["Trie","insert","search","search","startsWith","insert","search"]
[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]
输出：[null,null,true,false,true,null,true]
Java实现
class Trie {
    private TrieNode root;

    public Trie() {
        root = new TrieNode();
    }
    
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) {
                node.children[idx] = new TrieNode();
            }
            node = node.children[idx];
        }
        node.isEnd = true;
    }
    
    public boolean search(String word) {
        TrieNode node = findNode(word);
        return node != null && node.isEnd;
    }
    
    public boolean startsWith(String prefix) {
        return findNode(prefix) != null;
    }

    // 查找prefix对应的节点
    private TrieNode findNode(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) return null;
            node = node.children[idx];
        }
        return node;
    }

    // 前缀树节点
    private class TrieNode {
        boolean isEnd;
        TrieNode[] children;
        public TrieNode() {
            isEnd = false;
            children = new TrieNode[26]; // 26个小写字母
        }
    }
}

------------------

补充题2. 圆环回原点问题（中等）
题目描述
圆环上有n个位置（0到n-1），从0出发，每次可左/右移动1位，求走k步后回到0的方法数。
示例
输入：n=10, k=2
输出：2（0→1→0 或 0→9→0）
Java实现（动态规划）
class Solution {
    public int circleBackToOrigin(int n, int k) {
        // dp[i][j]：走i步到j的方法数
        int[][] dp = new int[k+1][n];
        dp[0][0] = 1; // 0步到0的方法数为1

        for (int i = 1; i <= k; i++) {
            for (int j = 0; j < n; j++) {
                // 左移：(j-1+n)%n；右移：(j+1)%n
                dp[i][j] = dp[i-1][(j-1 + n) % n] + dp[i-1][(j+1) % n];
            }
        }
        return dp[k][0];
    }
}

------------------

347. 前 K 个高频元素（中等）
leetcode: https://leetcode.cn/problems/top-k-frequent-elements/
题目描述
给定数组，找出出现频率前k高的元素。
示例
输入：nums = [1,1,1,2,2,3], k = 2
输出：[1,2]
Java实现（小顶堆）
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // 统计频率
        Map<Integer, Integer> freqMap = new HashMap<>();
        for (int num : nums) {
            freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
        }

        // 小顶堆：保存前k高频率的元素
        PriorityQueue<Integer> heap = new PriorityQueue<>(
            (a, b) -> freqMap.get(a) - freqMap.get(b)
        );
        for (int num : freqMap.keySet()) {
            heap.offer(num);
            if (heap.size() > k) {
                heap.poll(); // 弹出频率最低的
            }
        }

        // 提取结果
        int[] res = new int[k];
        for (int i = k-1; i >= 0; i--) {
            res[i] = heap.poll();
        }
        return res;
    }
}

------------------

剑指 Offer 10- I. 斐波那契数列（容易）
题目描述
求斐波那契数列的第n项（结果模1e9+7，F(0)=0, F(1)=1）。
示例
输入：n=5
输出：5
Java实现
class Solution {
    public int fib(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        int prev1 = 0, prev2 = 1;
        for (int i = 2; i <= n; i++) {
            int curr = (prev1 + prev2) % 1000000007;
            prev1 = prev2;
            prev2 = curr;
        }
        return prev2;
    }
}

------------------

445. 两数相加 II（中等）
leetcode: https://leetcode.cn/problems/add-two-numbers-ii/
题目描述
两个非空链表逆序存储数字，求它们相加后的链表（如7→2→4→3 + 5→6→4 = 7→8→0→7）。
示例
输入：l1 = [7,2,4,3], l2 = [5,6,4]
输出：[7,8,0,7]
Java实现（栈）
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        Stack<Integer> s1 = new Stack<>();
        Stack<Integer> s2 = new Stack<>();
        // 链表入栈
        while (l1 != null) {
            s1.push(l1.val);
            l1 = l1.next;
        }
        while (l2 != null) {
            s2.push(l2.val);
            l2 = l2.next;
        }

        int carry = 0;
        ListNode head = null;
        // 栈弹出相加，构造新链表（头插法）
        while (!s1.isEmpty() || !s2.isEmpty() || carry > 0) {
            int sum = carry;
            if (!s1.isEmpty()) sum += s1.pop();
            if (!s2.isEmpty()) sum += s2.pop();
            carry = sum / 10;
            ListNode newNode = new ListNode(sum % 10);
            newNode.next = head;
            head = newNode;
        }
        return head;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

------------------

45. 跳跃游戏 II（中等）
leetcode: https://leetcode.cn/problems/jump-game-ii/
题目描述
给定非负整数数组，每个元素表示最大跳跃长度，求跳到最后一个位置的最少步数。
示例
输入：nums = [2,3,1,1,4]
输出：2（0→1→4）
Java实现（贪心）
class Solution {
    public int jump(int[] nums) {
        int n = nums.length;
        int steps = 0;
        int maxReach = 0; // 当前步能到的最远位置
        int end = 0; // 当前步的边界

        for (int i = 0; i < n-1; i++) {
            maxReach = Math.max(maxReach, i + nums[i]);
            if (i == end) {
                // 到达当前步边界，步数+1，更新边界
                steps++;
                end = maxReach;
                if (end >= n-1) break; // 已能到达终点
            }
        }
        return steps;
    }
}

------------------

剑指 Offer 04. 二维数组中的查找（容易）
leetcode: https://leetcode.cn/problems/jian-zhi-offer-04/
题目描述
m×n二维数组，每行升序、每列升序，判断目标值是否存在。
示例
输入：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22]], target = 5
输出：true
Java实现
class Solution {
    public boolean findNumberIn2DArray(int[][] matrix, int target) {
        if (matrix == null || matrix.length == 0) return false;
        int m = matrix.length, n = matrix[0].length;
        int i = 0, j = n-1; // 从右上角开始搜索
        while (i < m && j >= 0) {
            if (matrix[i][j] == target) {
                return true;
            } else if (matrix[i][j] > target) {
                j--; // 目标更小，左移
            } else {
                i++; // 目标更大，下移
            }
        }
        return false;
    }
}

------------------

678. 有效的括号字符串（中等）
leetcode: https://leetcode.cn/problems/valid-parenthesis-string/
题目描述
给定包含(、)、*的字符串，*可表示(、)、空，判断字符串是否有效。
示例
输入："(*))"
输出：true
Java实现（双栈）
class Solution {
    public boolean checkValidString(String s) {
        Stack<Integer> leftStack = new Stack<>(); // 存左括号索引
        Stack<Integer> starStack = new Stack<>(); // 存星号索引

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') {
                leftStack.push(i);
            } else if (c == '*') {
                starStack.push(i);
            } else {
                // 优先用左括号匹配
                if (!leftStack.isEmpty()) {
                    leftStack.pop();
                } else if (!starStack.isEmpty()) {
                    starStack.pop(); // 用星号匹配
                } else {
                    return false; // 无匹配项
                }
            }
        }

        // 剩余左括号用星号匹配（星号索引需大于左括号）
        while (!leftStack.isEmpty() && !starStack.isEmpty()) {
            if (leftStack.pop() > starStack.pop()) {
                return false;
            }
        }
        return leftStack.isEmpty();
    }
}

------------------

295. 数据流的中位数（困难）
leetcode: https://leetcode.cn/problems/find-median-from-data-stream/
题目描述
设计数据结构，动态添加元素并能快速找出当前数据流的中位数。
示例
输入：["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]
[[],[1],[2],[],[3],[]]
输出：[null,null,null,1.5,null,2.0]
Java实现（双堆）
class MedianFinder {
    private PriorityQueue<Integer> maxHeap; // 存左半部分（大顶堆）
    private PriorityQueue<Integer> minHeap; // 存右半部分（小顶堆）

    public MedianFinder() {
        maxHeap = new PriorityQueue<>((a, b) -> b - a);
        minHeap = new PriorityQueue<>();
    }
    
    public void addNum(int num) {
        // 先加入大顶堆，再平衡到小顶堆
        maxHeap.offer(num);
        minHeap.offer(maxHeap.poll());
        // 保持大顶堆大小 ≥ 小顶堆
        if (maxHeap.size() < minHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }
    
    public double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.peek();
        } else {
            return (maxHeap.peek() + minHeap.peek()) / 2.0;
        }
    }
}

------------------

213. 打家劫舍 II（中等）
leetcode: https://leetcode.cn/problems/house-robber-ii/
题目描述
房屋围成环形，不能偷相邻房屋，求能偷到的最大金额（分“不偷第一个”或“不偷最后一个”两种情况）。
示例
输入：nums = [2,3,2]
输出：3（偷第二个）
Java实现
class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        // 情况1：不偷第一个；情况2：不偷最后一个
        return Math.max(robRange(nums, 1, nums.length-1), 
                        robRange(nums, 0, nums.length-2));
    }

    // 普通打家劫舍逻辑
    private int robRange(int[] nums, int start, int end) {
        int prev1 = 0, prev2 = 0;
        for (int i = start; i <= end; i++) {
            int curr = Math.max(prev2, prev1 + nums[i]);
            prev1 = prev2;
            prev2 = curr;
        }
        return prev2;
    }
}

------------------

287. 寻找重复数（中等）
leetcode: https://leetcode.cn/problems/find-the-duplicate-number/
题目描述
数组元素为[1, n]，有且仅有一个重复数，找出该数（要求空间O(1)）。
示例
输入：nums = [1,3,4,2,2]
输出：2
Java实现（快慢指针）
class Solution {
    public int findDuplicate(int[] nums) {
        // 视为链表，重复数为环的入口
        int slow = nums[0], fast = nums[nums[0]];
        // 找相遇点
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[nums[fast]];
        }
        // 找环入口
        fast = 0;
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}


