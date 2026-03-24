题目记录
两数之和（简单）
leetcode: https://leetcode.cn/problems/two-sum/
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
 public int[] twoSum(int[] nums, int target) {
       int len=nums.length;
       Map<Integer,Integer> map=new HashMap<>();
       for(int i=0;i<len;++i){
        if(map.containsKey(target-nums[i])){
            return new int[]{map.get(target-nums[i]),i};
        }
        map.put(nums[i],i);
       }
       return new int[]{0,0}; 
    }
无重复字符的最长子串（中等）
leetcode: https://leetcode.cn/problems/longest-substring-without-repeating-characters/
给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。
public int lengthOfLongestSubstring(String s) {
        int len=s.length();
        Map<Character,Integer> map=new HashMap<>();
        int max=0,left=0;
        for(int i=0;i<len;++i){
            char c=s.charAt(i);
            if(map.containsKey(c)&&map.get(c)>=left){
               left=map.get(c)+1;               
            }
            map.put(c,i);
            max=Math.max(max,i-left+1);    
        }
        return max;
    }
两数相加（中等）
leetcode: https://leetcode.cn/problems/add-two-numbers/
给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
请你将两个数相加，并以相同形式返回一个表示和的链表。
public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
       if(l1==null||l2==null) return l1==null?l2:l1;
       ListNode dummy=new ListNode(0);
       ListNode tem=dummy;
       int sum=0,carry=0,remain=0;
       while(l1!=null||l2!=null){
        int c1=l1==null?0:l1.val;
        int c2=l2==null?0:l2.val;
        sum=c1+c2+carry;
        carry=sum/10;
        remain=sum%10;
        tem.next=new ListNode(remain);
        tem=tem.next;
        if(l1!=null) l1=l1.next;
        if(l2!=null) l2=l2.next;
       }
       if(carry>0){
        tem.next=new ListNode(1);
       } 
       return dummy.next;
    }
最长回文子串（中等）
leetcode: https://leetcode.cn/problems/longest-palindromic-substring/
给你一个字符串 s，找到 s 中最长的回文子串。
如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。
 public String longestPalindrome(String s) {
       int n=s.length();
       if(n<2) return s;
       boolean[][] dp=new boolean[n][n];
       for(int i=0;i<n;++i){
        dp[i][i]=true;
       }
       int start=0;
       int maxlen=1;
       char[] sArr=s.toCharArray();
       for(int L=1;L<n;++L){
        for(int i=0;i<n;++i){
            int j=L+i;
            if(j>=n){
                break;
            }
            if(sArr[i]!=sArr[j]){
                dp[i][j]=false;
            }else{
                if(j-i<=2){
                    dp[i][j]=true;
                }else{
                    dp[i][j]=dp[i+1][j-1];
                }
            }
            if(dp[i][j]&&j-i+1>maxlen){
                maxlen=j-i+1;
                start=i;
            }
        }
       }
       return s.substring(start,start+maxlen); 
    }
  public String longestPalindrome(String s) {
      char[] sarr=s.toCharArray();  
      int start=0,end=0;
      int maxlen=0;
      for(int i=0;i<s.length();++i){
        int len1=expand(sarr,i,i);
        int len2=expand(sarr,i,i+1);
        maxlen=Math.max(len1,len2);
        if(maxlen>end-start+1){
            start=i-(maxlen-1)/2;
            end=i+maxlen/2;
        }
      }
      return s.substring(start,end+1);
    }
    int expand(char[] arr,int i,int j){
        while(i>=0&&j<arr.length&&arr[i]==arr[j]){
            i--;
            j++;
        }
        return j-i-1;
    }
盛水最多的容器（中等）
leetcode: https://leetcode.cn/problems/container-with-most-water/
给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。
找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
返回容器可以储存的最大水量
[图片]
  public int maxArea(int[] height) {
        int len=height.length;
        int max=0;
        int left=0,right=len-1;
        while(left!=right){
            int tem=Math.min(height[left],height[right])*(right-left);
            max=Math.max(tem,max);
            if(height[left]<height[right]) left++;
            else right--;
        }
        return max;
    }
三数之和（中等）
leetcode: https://leetcode.cn/problems/3sum/
给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请你返回所有和为 0 且不重复的三元组。
public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> resList=new ArrayList<>();
        Arrays.sort(nums);
        if(nums[0]>0) return resList;
        int len=nums.length;
        for(int i=0;i<len;i++){
            int left=i+1;
            int right=len-1;
            if(i>0&&nums[i]==nums[i-1]) continue;
            while(left<right){
                if(nums[i]+nums[left]+nums[right]<0){
                    left++;
                }else if(nums[i]+nums[left]+nums[right]>0){
                    right--;
                }else{
                    resList.add(Arrays.asList(nums[i],nums[left],nums[right]));
                    while(left<right&&nums[left]==nums[left+1]){
                        left++;
                    }
                    while(left<right&&nums[right]==nums[right-1]){
                        right--;
                    }
                    left++;
                    right--;
                }
            }
        }
        return resList;
    }
电话号码的字母组合（中等）
leetcode: https://leetcode.cn/problems/letter-combinations-of-a-phone-number/
给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。
给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
[图片]
public List<String> letterCombinations(String digits) {
        int n=digits.length();
        if(n==0) return List.of();
        String[] MAPPING=new String[]{"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
        List<String> ans=new ArrayList<>();
        char[] path=new char[n];
        dfs(0,MAPPING,digits.toCharArray(),ans,path);
        return ans;
    }
    void dfs(int i,String[] MAPPING,char[] digits,List<String> ans,char[] path){
        if(i==digits.length){
            ans.add(new String(path));
            return;
        }
        String letters=MAPPING[digits[i]-'0'];
        for(char c:letters.toCharArray()){
            path[i]=c;
            dfs(i+1,MAPPING,digits,ans,path);
        }
    }
删除链表的倒数第N个结点（中等）
leetcode: https://leetcode.cn/problems/remove-nth-node-from-end-of-list/
给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
   public ListNode removeNthFromEnd(ListNode head, int n) {
       ListNode dummy=new ListNode(0,head);
       ListNode slow=dummy;
       ListNode fast=head;
       for(int i=0;i<n;++i){
        fast=fast.next;
       }
       while(fast!=null){
        slow=slow.next;
        fast=fast.next;
       }
       slow.next=slow.next.next;
       return dummy.next;
    }
有效的括号（简单）
leetcode: https://leetcode.cn/problems/valid-parentheses/
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
有效字符串需满足：
1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。
public boolean isValid(String s) {
        int n=s.length();
        Deque<Character> stack=new ArrayDeque<>();
        if(n<2) return false;
        for(int i=0;i<n;++i){
            char c=s.charAt(i);
            if(c=='(') stack.push(')');
            else if(c=='[') stack.push(']');
            else if(c=='{') stack.push('}');
            else{
                if(!stack.isEmpty()&&c==stack.peek()){
                    stack.pop();
                    continue;
                }else{
                    return false;
                }
            }
        }
        
        return stack.isEmpty();
    }
合并两个有序链表（简单）
leetcode: https://leetcode.cn/problems/merge-two-sorted-lists/
将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。
public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dumHead=new ListNode(-1);
        ListNode tem=dumHead;
        ListNode cur1=list1,cur2=list2;
        while(cur1!=null&&cur2!=null){
           if(cur1.val<=cur2.val){
            dumHead.next=cur1;
            cur1=cur1.next;
            dumHead=dumHead.next;
           }else{
            dumHead.next=cur2;
            cur2=cur2.next;
            dumHead=dumHead.next;
           }
        }
        dumHead.next=cur1==null?cur2:cur1;
        return tem.next;
    }
括号生成（中等）
leetcode: https://leetcode.cn/problems/generate-parentheses/
数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
public List<String> generateParenthesis(int n) {
        List<String> res=new ArrayList<>();
        char[] path=new char[n*2];
        backtracking(res,path,n,0,0);
        return res;
    }
    void backtracking(List<String> res,char[] path,int n,int left,int right){
        if(right==n){
            res.add(new String(path));
            return;
        }
        if(left<n){
            path[left+right]='(';
            backtracking(res,path,n,left+1,right);
        }
        if(right<left){
            path[left+right]=')';
            backtracking(res,path,n,left,right+1);
        }
    }
1. 当我们要给出n个括号对组成的结果集 f(n)时，在这个结果中，所有字符串的第一个元素必然是 "("
2. 那么必然有另一个与之匹配的右括号 ")"
3. 那么还有 n-1 个括号对需要安放
4. 这 n-1 个括号对中，可以有 j 个括号对位于上述这对括号的内部，那么剩余的 n-1-j 个括号对都在上述括号对右侧
5. j的取值范围应该是 [0, n-1]
6. 所以在计算f(n)时， 我们是需要知道 f(0), f(1), ... f(n-1)的结果的，因此需要用map保存dp过程中的每一个结果
下一个排列（中等）
leetcode: https://leetcode.cn/problems/next-permutation/
整数数组的一个 排列  就是将其所有成员以序列或线性顺序排列。
- 例如，arr = [1,2,3] ，以下这些都可以视作 arr 的排列：[1,2,3]、[1,3,2]、[3,1,2]、[2,3,1] 。
整数数组的 下一个排列 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 下一个排列 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。
- 例如，arr = [1,2,3] 的下一个排列是 [1,3,2] 。
- 类似地，arr = [2,3,1] 的下一个排列是 [3,1,2] 。
- 而 arr = [3,2,1] 的下一个排列是 [1,2,3] ，因为 [3,2,1] 不存在一个字典序更大的排列。
给你一个整数数组 nums ，找出 nums 的下一个排列。
必须原地修改，只允许使用额外常数空间。
 public void nextPermutation(int[] nums) {
        int i=nums.length-2;
        while(i>=0&&nums[i]>=nums[i+1]){
            i--;
        }
        if(i>=0){
            int j=nums.length-1;
            while(j>=0&&nums[i]>=nums[j]){
                j--;
            }
            swap(nums,i,j);
        }
        reverse(nums,i+1);
        
    }
    void swap(int[] nums,int l,int r){
        int temp=nums[l];
        nums[l]=nums[r];
        nums[r]=temp;
    }
    void reverse(int[] nums,int start){
        int end=nums.length-1;
        while(start<end){
            swap(nums,start,end);
            start++;
            end--;
        }
    }
搜索旋转排序数组（中等）
leetcode: https://leetcode.cn/problems/search-in-rotated-sorted-array/
整数数组 nums 按升序排列，数组中的值 互不相同 。
在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 向左旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 下标 3 上向左旋转后可能变为 [4,5,6,7,0,1,2] 。
给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。
你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。
class Solution {
    public int search(int[] nums, int target) {
        int n=nums.length;
        int left=0,right=n-1;
        while(left<=right){
            int mid =left+(right-left)/2;
            if(nums[mid]==target) return mid;
            if(nums[mid]>=nums[left]){
                if(target>=nums[left]&&target<=nums[mid]){
                    right=mid-1;
                }else{
                    left=mid+1;
                }
            }else{
                if(target<=nums[right]&&target>=nums[mid]){
                    left=mid+1;
                }else{
                    right=mid-1;
                }
            }
        }
        return -1;
    }
}
 public int search(int[] nums, int target) {
        int n=nums.length;
        int left=-1,right=n-1;
        int mark=nums[n-1];
        while(left+1<right){
            int mid=left+(right-left)/2;
            int tem=nums[mid];
            if(tem==target) return mid;
            if(mark>=tem){
                if(target>=tem&&target<=mark){
                    left=mid;
                }else{
                    right=mid;
                }

            }else{
                if(target>=nums[0]&&target<tem){
                    right=mid;
                }else{
                    left=mid;
                }

            }
        }
        return  nums[right] == target ? right : -1;
    }
在排序数组中查找元素的第一个和最后一个位置（中等）
leetcode: https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/
给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。
如果数组中不存在目标值 target，返回 [-1, -1]。
你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。
class Solution {
    public int[] searchRange(int[] nums, int target) {
       int start=TwoSearch(nums,target);
       if(start==nums.length||nums[start]!=target){
        return new int[]{-1,-1};
       }
       int end=TwoSearch(nums,target+1)-1;
       return new int[]{start,end};
        
    }
    int TwoSearch(int[] nums,int target){
        int left=0,right=nums.length-1;
        while(left<=right){
            int mid=left+(right-left)/2;
            if(nums[mid]>=target) right=mid-1;
            else left=mid+1;
        }
        return left;
    }
}
   public int[] searchRange(int[] nums, int target) {
        int left=TwoSearch(nums,target);
        if(left==nums.length||nums[left]!=target){
            return new int[]{-1,-1};
        }
        int right=TwoSearch(nums,target+1)-1;
        return new int[]{left,right};
    }
    int TwoSearch(int[] nums,int target){
        int left=-1,right=nums.length;
        while(left+1<right){
            int mid=left+(right-left)/2;
            if(nums[mid]<target) left=mid;
            else right=mid;
        }
        return right;
    }
组合总和（中等）
leetcode: https://leetcode.cn/problems/combination-sum/
给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。
candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是不同的。 
对于给定的输入，保证和为 target 的不同组合数少于 150 个。
   public List<List<Integer>> combinationSum(int[] candidates, int target) {
       List<List<Integer>> res=new ArrayList<>();
       List<Integer> list=new ArrayList<>();
       backtracking(candidates,target,res,list,0); 
       return res;
    }
    void backtracking(int[] candidates,int target,List<List<Integer>> res,List<Integer> list,int index){
        if(target<0) return;
        if(target==0){
            res.add(new ArrayList<>(list));
            return;
        }
        for(int i=index;i<candidates.length;++i){
            list.add(candidates[i]);
            int tem=target-candidates[i];
            backtracking(candidates,tem,res,list,i);
            list.removeLast();
        }
    }
全排列（中等）
leetcode: https://leetcode.cn/problems/permutations/
给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。
 public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res=new ArrayList<>();
        List<Integer> list=new ArrayList<>();
        int len=nums.length;
        boolean[] b=new boolean[len];
        backtracking(nums,res,list,b);
        return res;
    }
    void backtracking(int[] nums,List<List<Integer>> res,List<Integer> list,boolean[] b){
        int len=nums.length;
        if(list.size()==len){
            res.add(new ArrayList<>(list));
            return;
        }
        for(int i=0;i<len;++i){
            if(!b[i]){
                list.add(nums[i]);
                b[i]=true;
                backtracking(nums,res,list,b);
                list.removeLast();
                b[i]=false;  
        }
            }
            
    
    }
旋转图像（中等）
leetcode: https://leetcode.cn/problems/rotate-image/
给定一个 n × n 的二维矩阵 matrix 表示一个图像。请你将图像顺时针旋转 90 度。
你必须在原地 旋转图像，这意味着你需要直接修改输入的二维矩阵。请不要 使用另一个矩阵来旋转图像。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
[图片]
 public void rotate(int[][] matrix) {
        int m=matrix.length,n=matrix[0].length;
        for(int i=0;i<m/2;++i){
            for(int j=0;j<(n+1)/2;++j){
                int tem=matrix[i][j];
                matrix[i][j]=matrix[n-j-1][i];
                matrix[n-j-1][i]=matrix[n-i-1][n-j-1];
                matrix[n-i-1][n-j-1]=matrix[j][n-i-1];
                matrix[j][n-i-1]=tem;
            }
        }
        
    }
字母异位词分组（中等）
leetcode: https://leetcode.cn/problems/group-anagrams/
给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。
[图片]
   public List<List<String>> groupAnagrams(String[] strs) {
        Map<String,List<String>> hash=new HashMap<>();
        for(String s:strs){
          char[] arr=s.toCharArray();
          Arrays.sort(arr);
          String res=new String(arr);
          if(!hash.containsKey(res)){
            hash.put(res,new ArrayList<>());
          }
          hash.get(res).add(s);
        }
        
        return new ArrayList<>(hash.values());
    }
最大子数组和（中等）
leetcode: https://leetcode.cn/problems/maximum-subarray/
给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
子数组是数组中的一个连续部分
public int maxSubArray(int[] nums) {
      int len=nums.length;
      int tem=nums[0];
      int max=nums[0];
      for(int i=1;i<len;i++){
        tem=Math.max(nums[i],tem+nums[i]);
        max=Math.max(tem,max);
      }
      return max;  
    }
跳跃游戏（中等）
leetcode: https://leetcode.cn/problems/jump-game/
给你一个非负整数数组 nums ，你最初位于数组的 第一个下标 。数组中的每个元素代表你在该位置可以跳跃的最大长度。
判断你是否能够到达最后一个下标，如果可以，返回 true ；否则，返回 false 。
public boolean canJump(int[] nums) {
        int n=nums.length;
        int max=nums[0];
        for(int i=0;i<=max;++i){
              if(max>=n-1) return true;
            
            max=Math.max(max,i+nums[i]);
          
        }
        return false;
    }
跳跃游戏II（中等）
leetcode: https://leetcode.cn/problems/jump-game-ii/
给定一个长度为 n 的 0 索引整数数组 nums。初始位置在下标 0。
每个元素 nums[i] 表示从索引 i 向后跳转的最大长度。换句话说，如果你在索引 i 处，你可以跳转到任意 (i + j) 处：
- 0 <= j <= nums[i] 且
- i + j < n
返回到达 n - 1 的最小跳跃次数。测试用例保证可以到达 n - 1。
 public int jump(int[] nums) {
       int n=nums.length;
       int cur=0,steps=0,next=0;
       for(int i=0;i<n-1;++i){
        cur=Math.max(cur,i+nums[i]);
        //范围 
        if(i==next){
            next=cur;
            steps++;
        }
       }
       return steps; 
    }
合并区间（中等）
leetcode: https://leetcode.cn/problems/merge-intervals/
以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。
public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals,(a,b)->(a[0]-b[0]));
        List<int[]> res=new ArrayList<>();
        int[] cur=intervals[0];
        res.add(cur);
        for(int i=1;i<intervals.length;++i){
            int[] next=intervals[i];
            if(next[0]<=cur[1]){
                cur[1]=Math.max(next[1],cur[1]);
            }else{
                cur=next;
                res.add(cur);
            }
        }
        return res.toArray(new int[res.size()][]);
    }
不同路径（中等）
leetcode: https://leetcode.cn/problems/unique-paths/
一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
问总共有多少条不同的路径？
public int uniquePaths(int m, int n) {
        int[][] dp=new int[m+1][n+1];
        for(int i=1;i<=m;++i){
            dp[i][1]=1;
        }
        for(int i=1;i<=n;++i){
            dp[1][i]=1;
        }
        for(int i=2;i<=m;++i){
            for(int j=2;j<=n;++j){
                dp[i][j]=dp[i-1][j]+dp[i][j-1];
            }
        }
        return dp[m][n];
    }
最小路径和（中等）
leetcode: https://leetcode.cn/problems/minimum-path-sum/
给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
说明：每次只能向下或者向右移动一步。
   public int minPathSum(int[][] grid) {
     int m=grid.length,n=grid[0].length;
     int[][] dp=new int[m][n]; 
     dp[0][0]=grid[0][0];
     for(int i=1;i<m;++i){
        dp[i][0]=dp[i-1][0]+grid[i][0];
     }
     for(int i=1;i<n;++i){
        dp[0][i]=dp[0][i-1]+grid[0][i];
     }
     for(int i=1;i<m;++i){
        for(int j=1;j<n;++j){
            dp[i][j]=Math.min(dp[i-1][j],dp[i][j-1])+grid[i][j];
        }
     }
     return dp[m-1][n-1];   
    }
颜色分类（中等）
leetcode: https://leetcode.cn/problems/sort-colors/
给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地 对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。
必须在不使用库内置的 sort 函数的情况下解决这个问题。
class Solution {
    public void sortColors(int[] nums) {
      int n=nums.length;
      int gl=0,gr=n-1,i=0;
      while(i<=gr){
        if(nums[i]==0){
            swap(nums,gl,i);
            gl++;
            i++;
        }
        else if(nums[i]==1) i++;
        else {
            swap(nums,gr,i);
            gr--;
        }
      }
    }
    void swap(int[] nums,int left,int right){
        int tem=nums[left];
        nums[left]=nums[right];
        nums[right]=tem;
    }
}
public void sortColors(int[] nums) {
      int n=nums.length;
      int p0=0,p1=0;
      for(int i=0;i<n;i++){
        if(nums[i]==0){
            int temp=nums[i];
            nums[i]=nums[p0];
            nums[p0]=temp;
            if(p0<p1){
             temp=nums[i];
                nums[i]=nums[p1];
                nums[p1]=temp;
            }
            p0++;
            p1++;
        }else if(nums[i]==1){
            int temp=nums[i];
            nums[i]=nums[p1];
            nums[p1]=temp;
            p1++;
        }
       
      } 
    }
本质上是快排的变形
子集（中等）
leetcode: https://leetcode.cn/problems/subsets/
给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res=new ArrayList<>();
        List<Integer> list=new ArrayList<>();
        dfs(nums,res,list,0);
        return res;
    }
    void dfs(int[] nums,List<List<Integer>> res,List<Integer> list,int index){
        res.add(new ArrayList<>(list));
        
        for(int i=index;i<nums.length;++i){
            list.add(nums[i]);
            dfs(nums,res,list,i+1);
            list.removeLast();
        }

    }
单词搜索（中等）
leetcode: https://leetcode.cn/problems/word-search/
给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。
单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用
class Solution {
    int[][] bis={{0,1},{0,-1},{1,0},{-1,0}};
    boolean res=false;
    
    public boolean exist(char[][] board, String word) {
     
    int m=board.length,n=board[0].length;
   
    int start=0,end=0;
    for(int i=0;i<m;++i){
        for(int j=0;j<n;++j){
           if(board[i][j]==word.charAt(0)){
              dbs(board,word,i,j,0);
              if(res) return true;
           } 
        }
    }
    return res;
    }
    void dbs(char[][] board,String word,int i,int j,int index){
        if(res||i<0||i>=board.length||j<0||j>=board[0].length){
            return;
        }
        if(board[i][j]!=word.charAt(index)){
           return;  
        }
        if(index==word.length()-1){
            res=true;
            return;
        }
        char temp=board[i][j];
        board[i][j]='#';
        for(int[] dir:bis){
            dbs(board,word,i+dir[0],j+dir[1],index+1);
        }
        board[i][j]=temp;
    }
}
中序遍历（简单）
leetcode: https://leetcode.cn/problems/binary-tree-inorder-traversal/
给定一个二叉树的根节点 root ，返回 它的 中序 遍历 。
   public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res=new ArrayList<>();

        dfs(root,res);
        return res;
    }
    void dfs(TreeNode root,List<Integer> res){
        if(root==null) return;
        dfs(root.left,res);
        res.add(root.val);
        dfs(root.right,res);
        
    }
验证二叉搜索树（中等）
leetcode: https://leetcode.cn/problems/validate-binary-search-tree/
给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。
有效 二叉搜索树定义如下：
- 节点的左子树只包含 严格小于 当前节点的数。
- 节点的右子树只包含 严格大于 当前节点的数。
- 所有左子树和右子树自身必须也是二叉搜索树
class Solution {
    TreeNode pre=null;
    public boolean isValidBST(TreeNode root) {
        if(root==null) return true;
        boolean left=isValidBST(root.left);
        if(pre!=null&&pre.val>=root.val){
            return false;
        }
        pre=root;
        boolean right=isValidBST(root.right);
      
      return left&&right;  
    }
}
对称二叉树（简单）
leetcode: https://leetcode.cn/problems/symmetric-tree/
给你一个二叉树的根节点 root ， 检查它是否轴对称。
   public boolean isSymmetric(TreeNode root) {
        return F(root.left,root.right);

    }
    boolean F(TreeNode left,TreeNode right){
        if(left==null&&right==null){
            return true;
        }
        if(left==null||right==null){
            return false;
        }
        return left.val==right.val&&F(left.left,right.right)&&F(left.right,right.left);
    }
二叉树的最大深度（简单）
leetcode: https://leetcode.cn/problems/maximum-depth-of-binary-tree/
给定一个二叉树 root ，返回其最大深度。
二叉树的 最大深度 是指从根节点到最远叶子节点的最长路径上的节点数。
  public int maxDepth(TreeNode root) {
        return dfs(root,1);
    }
    int dfs(TreeNode node,int depth){
        if(node==null) return depth-1;
        int left=dfs(node.left,depth+1);
        int right=dfs(node.right,depth+1);
        return Math.max(left,right);
    }
从前序和中序遍历序列构造二叉树（中等）
leetcode: https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
class Solution {
    Map<Integer,Integer> indexMap;
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        indexMap=new HashMap<>();
       int len=inorder.length;
       for(int i=0;i<len;++i){
        indexMap.put(inorder[i],i);
       } 
        return reverBuild(preorder,inorder,0,len-1,0,len-1);
    }
    TreeNode reverBuild(int[] preorder,int[] inorder,int pr_star,int pr_end,int in_star,int in_end){
        if(pr_star>pr_end) return null;
        TreeNode root=new TreeNode(preorder[pr_star]);
        int new_in_star=indexMap.get(preorder[pr_star]);
        int distance=new_in_star-in_star;
        root.left=reverBuild(preorder,inorder,pr_star+1,pr_star+distance,in_star,new_in_star);
        root.right=reverBuild(preorder,inorder,pr_star+distance+1,pr_end,new_in_star+1,in_end);
        return root;
    }
}
买卖股票的最佳时机（简单）
leetcode: https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/
给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。
返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
 public int maxProfit(int[] prices) {
      int min=Integer.MAX_VALUE,profit=0;
      int n=prices.length;
      for(int i=0;i<n;++i){
        min=Math.min(min,prices[i]);
        profit=Math.max(profit,prices[i]-min);
      }
      return profit;  
    }
最长连续序列（中等）
leetcode: https://leetcode.cn/problems/longest-consecutive-sequence/
给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
请你设计并实现时间复杂度为 O(n) 的算法解决此问题。
public int longestConsecutive(int[] nums) {
       if(nums==null||nums.length==0) return 0;
       if(nums.length==1) return 1;
       int len=nums.length;
       Set<Integer> set=new HashSet<>();
       for(int n:nums){
        set.add(n);
       }
       int res=0;
       for(int n:set){
        if(!set.contains(n-1)){
            int cur=1;
            int t=1;
            while(set.contains(n+t)){
                cur++;
                t++;
            }
            res=cur>res?cur:res;
        }
       } 
       return res;
    }
只出现一次的数字（简单）
leetcode: https://leetcode.cn/problems/single-number/
给你一个 非空 整数数组 nums ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。
你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。
 public int singleNumber(int[] nums) {
        int sum=0;
        for(int i=0;i<nums.length;++i){
            sum^=nums[i];
        }
        return sum;
    }

//重复的相消 相同为0 不同为1 异或
单词拆分（中等）
leetcode: https://leetcode.cn/problems/word-break/
给你一个字符串 s 和一个字符串列表 wordDict 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 s 则返回 true。
注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。
//构建字典树Trie实现 
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        TrieNode root = buildDict(wordDict);
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        for (int i = 1; i <= n; ++i) {
            TrieNode node = root;
            for (int j = 0; j < i; ++j) {
                if (!dp[j])
                    continue;
                node = root; // 每次重新从根节点开始匹配
                boolean match = true;
                for (int k = j; k < i; ++k) {
                    char c = s.charAt(k);
                    int index = c - 'a';
                    if (node.children[index] == null) {
                        match = false;
                        break;
                    }
                    node = node.children[index];
                }
                if (match && node.isEnd) {
                    dp[i] = true;
                    break; // 找到一个匹配即可
                }
            }

        }
        return dp[n];
    }

    class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }

    TrieNode buildDict(List<String> wordDict) {
        TrieNode root = new TrieNode();
        for (String str : wordDict) {
            TrieNode tem = root;
            for (char c : str.toCharArray()) {
                int index = c - 'a';
                if (tem.children[index] == null) {
                    tem.children[index] = new TrieNode();
                }
                tem = tem.children[index];
            }
            tem.isEnd = true;
        }
        return root;
    }
}
  public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> set=new HashSet<>(wordDict);
        int n=s.length();
        boolean[] dp=new boolean[n+1];
        dp[0]=true;
        for(int i=1;i<=n;++i){
            for(int j=0;j<i;++j){
                if(dp[j]&&set.contains(s.substring(j,i))){
                    dp[i]=true;
                    break;
                }
            }
        }
        return dp[n];
    }
环形链表（简单）
leetcode: https://leetcode.cn/problems/linked-list-cycle/
给你一个链表的头节点 head ，判断链表中是否有环。
如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。
如果链表中存在环 ，则返回 true 。 否则，返回 false
public boolean hasCycle(ListNode head) {
        if(head==null) return false;
        ListNode slow=head;
        ListNode fast=head;
        while(fast!=null&&fast.next!=null){
            slow=slow.next;
            fast=fast.next.next;
            if(slow==fast) return true;
        }
        return false;
    }
}
环形链表II（中等）
leetcode: https://leetcode.cn/problems/linked-list-cycle-ii/
给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。
不允许修改 链表。
 public ListNode detectCycle(ListNode head) {
        if(head==null) return null;
        ListNode slow=head;
        ListNode fast=head;
      while(fast!=null&&fast.next!=null){
        fast=fast.next.next;
        slow=slow.next;
        if(fast==slow) break;
      }
        if(fast==null||fast.next==null) return null;
        slow=head;
        while(slow!=fast){
            slow=slow.next;
            fast=fast.next;
        }
        return slow;
    }
排序链表（中等）
leetcode: https://leetcode.cn/problems/sort-list/
给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。
public ListNode sortList(ListNode head) {
        return sortAll(head,null);
    }
    ListNode sortAll(ListNode head,ListNode tail){
        if(head==null) return head;
        if(head.next==tail){
            head.next=null;
            return head;
        }
        ListNode slow=head;
        ListNode fast=head;
        while(fast!=tail){
            slow=slow.next;
            fast=fast.next;
            if(fast!=tail){
                fast=fast.next;
            }
        }
        ListNode mid=slow;
        ListNode l1=sortAll(head,slow);
        ListNode l2=sortAll(mid,tail);
        return merge(l1,l2);
    }
    ListNode merge(ListNode l1,ListNode l2){
        ListNode dummy=new ListNode(0);
        ListNode tem=dummy;
        while(l1!=null&&l2!=null){
            if(l1.val<=l2.val){
                tem.next=l1;
                l1=l1.next;
            }else{
                tem.next=l2;
                l2=l2.next;
            }
            tem=tem.next;
        }
        tem.next=l1==null?l2:l1;
        return dummy.next;
    }
LRU缓存（中等）
leetcode: https://leetcode.cn/problems/lru-cache/
给请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
实现 LRUCache 类：
- LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
- int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
- void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。
函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。
class LRUCache {
    class DlinkedNode{
        int key;
        int val;
        DlinkedNode prev;
        DlinkedNode next;
        DlinkedNode(){}
        DlinkedNode(int _key,int _val){
            key=_key;
            val=_val;
        }
    }
    private int size;
    private int capacity;
    private Map<Integer,DlinkedNode> cache=new HashMap<>();
    private DlinkedNode head,tail;
    public LRUCache(int capacity) {
        this.size=0;
        this.capacity=capacity;
        head=new DlinkedNode();
        tail=new DlinkedNode();
        head.next=tail;
        tail.prev=head;
    }
    
    public int get(int key) {
        DlinkedNode res=cache.get(key);
        if(res==null ){
            return -1;
        }
        moveToHead(res);
        return res.val;
    }
    
    public void put(int key, int value) {
        DlinkedNode res=cache.get(key);
        if(res!=null){
            res.val=value;
            moveToHead(res);
        }else{
            DlinkedNode newNode=new DlinkedNode(key,value);
            cache.put(key,newNode);
            addToHead(newNode);
            size++;
            if(size>capacity){
                DlinkedNode tail=removeTail();
                cache.remove(tail.key);
                size--;
            }
        }
    }
    void addToHead(DlinkedNode node){
        node.prev = head;
    DlinkedNode tem = head.next;
    head.next = node;
    tem.prev = node;  // 错误：此处应为 tem.prev = node
    node.next = tem;
        
    }
    void removeNode(DlinkedNode node){
        node.prev.next=node.next;
        node.next.prev=node.prev;
    }
    void moveToHead(DlinkedNode node){
        removeNode(node);
        addToHead(node);
    }
    DlinkedNode removeTail(){
        DlinkedNode res=tail.prev;
        removeNode(res);
        return res;
    }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache obj = new LRUCache(capacity);
 * int param_1 = obj.get(key);
 * obj.put(key,value);
 */
乘积最大的子数组（中等）
leetcode: https://leetcode.cn/problems/maximum-product-subarray/
给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续 子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。
测试用例的答案是一个 32-位 整数。
class Solution {
    public int maxProduct(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        
        // 初始化：以nums[0]结尾的最大/最小乘积都是nums[0]
        int dpMax = nums[0];
        int dpMin = nums[0];
        int result = nums[0]; // 全局最大乘积
        
        // 从第二个元素开始遍历（索引1）
        for (int i = 1; i < n; i++) {
            // 临时保存上一轮的dpMax，避免更新dpMax后覆盖，影响dpMin计算
            int tempMax = dpMax;
            
            // 计算当前dpMax：取「当前数」「前最大×当前数」「前最小×当前数」的最大值
            dpMax = Math.max(Math.max(nums[i], tempMax * nums[i]), dpMin * nums[i]);
            // 计算当前dpMin：取「当前数」「前最大×当前数」「前最小×当前数」的最小值
            dpMin = Math.min(Math.min(nums[i], tempMax * nums[i]), dpMin * nums[i]);
            
            // 更新全局最大乘积
            result = Math.max(result, dpMax);
        }
        
        return result;
    }
}
最小栈（中等）
leetcode: https://leetcode.cn/problems/min-stack/
设计一个支持 push（入栈）、pop（出栈）、top（获取栈顶元素）、getMin（检索栈中最小元素）的栈结构，所有操作的时间复杂度必须为 O (1)


class MinStack {
    // 1. 主栈：存储所有入栈元素
    private Deque<Integer> mainStack;
    // 2. 辅助栈：栈顶始终是当前主栈的最小值
    private Deque<Integer> minStack;

    // 构造方法：初始化两个栈
    public MinStack() {
        mainStack = new LinkedList<>();
        minStack = new LinkedList<>();
    }

    // 入栈操作
    public void push(int val) {
        // 主栈必入
        mainStack.push(val);
        // 辅助栈：空 或 新元素≤栈顶 → 入栈（保证栈顶是最小值）
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        }
    }

    // 出栈操作
    public void pop() {
        // 主栈弹出栈顶元素
        int popVal = mainStack.pop();
        // 若弹出的是当前最小值 → 辅助栈同步弹出
        if (popVal == minStack.peek()) {
            minStack.pop();
        }
    }

    // 获取栈顶元素
    public int top() {
        // 直接返回主栈顶
        return mainStack.peek();
    }

    // 获取最小值
    public int getMin() {
        // 直接返回辅助栈顶
        return minStack.peek();
    }
}
相交链表（简单）
leetcode: https://leetcode.cn/problems/intersection-of-two-linked-lists/
给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。
  public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode cur1=headA,cur2=headB;
        while(cur1!=cur2){
            cur1=cur1==null?headB:cur1.next;
            cur2=cur2==null?headA:cur2.next;
        }
        return cur1;
    }
多数元素（简单）
leetcode: https://leetcode.cn/problems/majority-element/
给定一个大小为 n 的数组 nums ，返回其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。
你可以假设数组是非空的，并且给定的数组总是存在多数元素。
 public int majorityElement(int[] nums) {
        int can=-1,vote=0;
        for(int num:nums){
            if(vote==0) can=num;
            if(num==can) vote++;
            else vote--;
        }
        return can;
    }
打家劫舍（中等）
leetcode: https://leetcode.cn/problems/house-robber/
你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。
   public int rob(int[] nums) {
      int n=nums.length;
      if(n==1) return nums[0];
      int[] dp=new int[n+1];
      dp[1]=nums[0];
      dp[2]=Math.max(nums[0],nums[1]);
      for(int i=3;i<=n;++i){
        dp[i]=Math.max(dp[i-2]+nums[i-1],dp[i-1]);
      }
      return dp[n];
    }
岛屿数量（中等）
leetcode: https://leetcode.cn/problems/number-of-islands/
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。
此外，你可以假设该网格的四条边均被水包围
  public int numIslands(char[][] grid) {
    int m=grid.length,n=grid[0].length;
    int res=0;
    int[][] offest=new int[][]{{0,1},{0,-1},{1,0},{-1,0}};
      for(int i=0;i<m;i++){
        for(int j=0;j<n;++j){
            if(grid[i][j]=='1'){
                grid[i][j]='0';
                res++;
                Deque<int[]> queue=new ArrayDeque<>();
                queue.offer(new int[]{i,j});
                
                while(!queue.isEmpty()){
                    int[] tem=queue.poll();
                    for(int[] of:offest){
                        int l=tem[0]+of[0];
                        int r=tem[1]+of[1];
                        if(l>=0&&l<m&&r>=0&&r<n&&grid[l][r]=='1'){
                            queue.offer(new int[]{l,r});
                            grid[l][r]='0';
                        }
                    }
                }
            }
        }
      }
      return res;  
    }
反转链表（简单）
leetcode: https://leetcode.cn/problems/reverse-linked-list/
给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
 public ListNode reverseList(ListNode head) {
      ListNode temp=head;
      ListNode pre=null;
      while(temp!=null){
        ListNode cur=temp.next;
        temp.next=pre;
        pre=temp;
        temp=cur;
      }
      return pre;  
    }
课程表（中等）
leetcode: https://leetcode.cn/problems/course-schedule/
你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。
在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程  bi 。
- 例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。
public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> edges = new ArrayList<>();
        int[] arr = new int[numCourses];
        for (int i = 0; i < numCourses; ++i) {
            edges.add(new ArrayList<>());
        }
        for (int[] pre : prerequisites) {
            edges.get(pre[1]).add(pre[0]);
            arr[pre[0]]++;
        }
        int count = 0;
        Deque<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < numCourses; ++i) {
            if (arr[i] == 0) {
                queue.offer(i);
            }
        }
        while (!queue.isEmpty()) {
            int i = queue.poll();
            count++;
            for (int t : edges.get(i)) {
                arr[t]--;
                if (arr[t] == 0) {
                    queue.offer(t);
                }

            }

        }
        return count == numCourses;

    }
实现Trie(前缀树）（中等）
leetcode: https://leetcode.cn/problems/implement-trie-prefix-tree/
Trie（发音类似 "try"）或者说 前缀树 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。
请你实现 Trie 类：
- Trie() 初始化前缀树对象。
- void insert(String word) 向前缀树中插入字符串 word 。
- boolean search(String word) 如果字符串 word 在前缀树中，返回 true（即，在检索之前已经插入）；否则，返回 false 。
- boolean startsWith(String prefix) 如果之前已经插入的字符串 word 的前缀之一为 prefix ，返回 true ；否则，返回 false 。
class Trie {
    Trie[] children;
    boolean isend;
    public Trie() {
        children=new Trie[26];
        isend=false;
    }
    
    public void insert(String word) {
        Trie node=this;
        int len=word.length();
        for(int i=0;i<len;++i){
            char c=word.charAt(i);
            int index=c-'a';
            if(node.children[index]==null){
                node.children[index]=new Trie();
            }
            node=node.children[index];
        }
        node.isend=true;
    }
    
    public boolean search(String word) {
        Trie node=searchWhith(word);
        return startsWith(word)&&node.isend==true;
    }
   
    public boolean startsWith(String prefix) {
        Trie node=searchWhith(prefix);
        return node==null?false:true;
        
    }
    Trie searchWhith(String prefix){
        Trie node=this;
        for(int i=0;i<prefix.length();++i){
            char c=prefix.charAt(i);
            int index=c-'a';
            if(node.children[index]==null){
                return null;
            }
            node=node.children[index];
        }
        return node;
    }
}
数组中的第K个最大元素（中等）
leetcode: https://leetcode.cn/problems/kth-largest-element-in-an-array/
给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。
public int findKthLargest(int[] nums, int k) {
      int n=nums.length;
      return quickSelect(nums,n-k,0,n-1);
      
    }
    int quickSelect(int[] nums,int k,int left,int right){
        if(left==right) return nums[k];
        int i=left-1,j=right+1;
        int t=nums[left];
        while(i<j){
            do{i++;}while(nums[i]<t);
            do{j--;}while(nums[j]>t);
            if(i<j){
               int tem=nums[i];
               nums[i]=nums[j];
               nums[j]=tem;
            }
        }
        if(k<=j){
            return quickSelect(nums,k,left,j);
        }else{
            return quickSelect(nums,k,j+1,right);
        }
    }
class Solution {
    public int findKthLargest(int[] nums, int k) {
        return quickSelect(nums, k, 0, nums.length-1);
    }

    public int quickSelect(int[] nums, int k, int st, int ed) {
        if (st == ed) {
            return nums[st];
        }

        Random r = new Random();
        // 哨兵节点
        int pivotIndex = st + r.nextInt(ed-st+1);
        int pivot = nums[pivotIndex];

        swap(nums, st, pivotIndex);

        int left = st+1, right = ed;

        while (left < right) {
            while (nums[left] <= pivot && left < right) {
                left++;
            }

            while (nums[right] >= pivot && left < right) {
                right--;
            }

            if (left < right) {
                swap(nums, left, right);
            }
        }

        int pivotNewIndex = nums[left] < pivot ? left : left-1;

        swap(nums, st, pivotNewIndex);

        int rightNumAndPivot = ed-pivotNewIndex+1;
        if (rightNumAndPivot == k) {
            return nums[pivotNewIndex];
        } else if (rightNumAndPivot > k) {
            return quickSelect(nums, k, pivotNewIndex+1, ed);
        } else {
            return quickSelect(nums, k-rightNumAndPivot, st, pivotNewIndex-1);
        }
    }

    public void swap(int[] nums, int x, int y) {
        int tmp = nums[x];
        nums[x] = nums[y];
        nums[y] = tmp;
    }
}
柱状图中最大的矩形（困难）
leetcode: https://leetcode.cn/problems/largest-rectangle-in-histogram/
给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。
求在该柱状图中，能够勾勒出来的矩形的最大面积。
[图片]
public int largestRectangleArea(int[] heights) {
        Deque<Integer> stack=new ArrayDeque<>();
        int n=heights.length;
        int max=0;
        for(int i=0;i<=n;++i){
            int cur=i==n?0:heights[i];
            while(!stack.isEmpty()&&cur<heights[stack.peek()]){
                int height=heights[stack.pop()];
                int wid=stack.isEmpty()?i:i-stack.peek()-1;
                max=Math.max(max,height*wid);
            }
            stack.push(i);
        }
        return max;
    }
//避免暴力枚举所有可能的矩形，转而聚焦「每个柱子能作为最高矩形的最大范围」 
翻转二叉树（简单）
leetcode: https://leetcode.cn/problems/invert-binary-tree/
给你一棵二叉树的根节点 root ，翻转这棵二叉树，并返回其根节点。
[图片]
public TreeNode invertTree(TreeNode root) {
        if(root==null) return null;
        TreeNode left=invertTree(root.left);
        TreeNode right=invertTree(root.right);
        TreeNode tem=root.left;
        root.left=root.right;
        root.right=tem;
    
        return root;

    }
回文链表（简单）
leetcode: https://leetcode.cn/problems/palindrome-linked-list/
给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。
public boolean isPalindrome(ListNode head) {
        ListNode dummy=new ListNode(0,head);
        ListNode mid=findmid(head);
        ListNode start=reverse(mid.next);
        mid.next=null;
        while(head!=null&&start!=null){
            if(head.val!=start.val){
                return false;
            }
            head=head.next;
            start=start.next;
        }
        return true;


    }
    ListNode findmid(ListNode head){
         ListNode slow=head;
        ListNode fast=head.next;
        while(fast!=null&&fast.next!=null){
            slow=slow.next;
            fast=fast.next.next;
        }
        return slow;
    }
    ListNode reverse(ListNode head){
        ListNode pre=null;
        ListNode tem=head;
        while(tem!=null){
            ListNode cur=tem.next;
            tem.next=pre;
            pre=tem;
            tem=cur;
        }
        return pre;
    }
二叉树的最近公共祖先（中等）
leetcode: https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/
给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
百度百科中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”
 public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if(root==null) return null;
        if(root==p||root==q) return root;
        TreeNode left=lowestCommonAncestor(root.left,p,q);
        TreeNode right=lowestCommonAncestor(root.right,p,q);
        if(left!=null&&right!=null) return root;
        else if(left==null&&right!=null) return right;
        else if(left!=null&&right==null) return left;
        else return null;
    }
除自身以外数组的乘积（中等）
leetcode: https://leetcode.cn/problems/product-of-array-except-self/
给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积 。
题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。
请 不要使用除法，且在 O(n) 时间复杂度内完成此题。
[图片]
public int[] productExceptSelf(int[] nums) {
      int len=nums.length;
      int[] dp1=new int[len];
      int[] dp2=new int[len];
      dp1[0]=1;
      dp2[len-1]=1;
      for(int i=1;i<len;++i){
        dp1[i]=dp1[i-1]*nums[i-1];
      }
      for(int j=len-2;j>=0;--j){
        dp2[j]=dp2[j+1]*nums[j+1];
      }
      for(int i=0;i<len-1;++i){
        dp1[i]=dp1[i]*dp2[i];
      } 
      
      return dp1; 
    }
搜索二维矩阵II（中等）
leetcode: https://leetcode.cn/problems/search-a-2d-matrix-ii/
编写一个高效的算法来搜索 m x n 矩阵 matrix 中的一个目标值 target 。该矩阵具有以下特性：
- 每行的元素从左到右升序排列。
- 每列的元素从上到下升序排列。
[图片]
  public boolean searchMatrix(int[][] matrix, int target) {
        int m=matrix.length,n=matrix[0].length;
        int i=0,j=n-1;
        while(i<m&&j>=0){
            if(matrix[i][j]==target){
                return true;
            }else if(matrix[i][j]<target){
                i++;
            }else{
                j--;
            }
        }
        return false;
    }
完全平方数（中等）
leetcode: https://leetcode.cn/problems/perfect-squares/
给你一个整数 n ，返回 和为 n 的完全平方数的最少数量 。
完全平方数 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。
[图片]
 
public int numSquares(int n) {
int[] arr=new int[n+1];
Arrays.fill(arr,n+1);
arr[0]=0;
for(int i=1;i<=n;++i){
    for(int j=1;j*j<=i;++j){
        arr[i]=Math.min(arr[i],arr[i-j*j]+1);
    }
}
return arr[n];
}
移动零（简单）
leetcode: https://leetcode.cn/problems/move-zeroes/
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
请注意 ，必须在不复制数组的情况下原地对数组进行操作。
 public void moveZeroes(int[] nums) {
        if(nums.length<2) return;
       int len=nums.length;
       for(int i=0,j=0;i<len;++i){
        if(nums[i]!=0){
         int tem=nums[i];
         nums[i]=nums[j];
         nums[j]=tem;
         j++;
        }
       }
    
    }
// 通过两个指针 i（遍历指针）和 j（非 0 元素的 “存放指针”），让所有非 0 元素按原有顺序占据数组前面的位置，0 自然被 “挤” 到后面
寻找重复数（中等）
leetcode: https://leetcode.cn/problems/find-the-duplicate-number/
给定一个包含 n + 1 个整数的数组 nums ，其数字都在 [1, n] 范围内（包括 1 和 n），可知至少存在一个重复的整数。
假设 nums 只有 一个重复的整数 ，返回 这个重复的数 。
你设计的解决方案必须 不修改 数组 nums 且只用常量级 O(1) 的额外空间。
class Solution {
    public int findDuplicate(int[] nums) {
        // 步骤1：快慢指针找相遇点
        int slow = nums[0];   // 慢指针初始走1步（等价于从0出发走1步）
        int fast = nums[nums[0]]; // 快指针初始走2步（等价于从0出发走2步）
        
        // 循环直到快慢指针相遇
        while (slow != fast) {
            slow = nums[slow];       // 慢指针走1步
            fast = nums[nums[fast]]; // 快指针走2步
        }
        
        // 步骤2：找环的入口（重复数）
        slow = 0; // 慢指针重置到起点
        while (slow != fast) {
            slow = nums[slow]; // 慢指针走1步
            fast = nums[fast]; // 快指针走1步
        }
        
        return slow; // 相遇点即为重复数
    }
}
最长递增子序列（中等）
leetcode: https://leetcode.cn/problems/longest-increasing-subsequence/
给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。
 public int lengthOfLIS(int[] nums) {
       int n=nums.length;
       int[] dp=new int[n+1];
       int max=1;
       dp[0]=1;
       for(int i=1;i<n;++i){
        dp[i]=1;
        for(int j=0;j<i;++j){
            if(nums[j]<nums[i]){
                dp[i]=Math.max(dp[i],dp[j]+1);
            }
        }
        max=Math.max(dp[i],max);
       }
       return max;
        
    }
零钱兑换（中等）
leetcode: https://leetcode.cn/problems/coin-change/
给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。
你可以认为每种硬币的数量是无限的。
public int coinChange(int[] coins, int amount) {
        int n=coins.length;
        int[] arr=new int[amount+1];
        Arrays.fill(arr,amount+1);
        arr[0]=0;
        for(int i=0;i<n;++i){
            for(int j=coins[i];j<=amount;++j){
                arr[j]=Math.min(arr[j],arr[j-coins[i]]+1);
            }
        }
        return arr[amount]>amount?-1:arr[amount];
    }
字符串解码（中等）
leetcode: https://leetcode.cn/problems/decode-string/
给定一个经过编码的字符串，返回它解码后的字符串。
编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。
你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。
此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。
测试用例保证输出的长度不会超过 105。
public String decodeString(String s) {
      int n=s.length();
      Deque<Integer> numStack=new ArrayDeque<>();
      Deque<StringBuilder> strStack=new ArrayDeque<>();
      StringBuilder str=new StringBuilder();
      int k=0;
      for(int i=0;i<n;++i){
        char c=s.charAt(i);
        if(Character.isDigit(c)){
            k=k*10+(c-'0');
        }else if(c=='['){
            numStack.push(k);
            strStack.push(str);
            k=0;
            str=new StringBuilder();
            
        }else if(c==']'){
            int index=numStack.pop();
            StringBuilder sbt=strStack.pop();
            for(int j=0;j<index;++j){
                sbt.append(str);
            }
            str=sbt;
        }else{
            str.append(c);
        }
      }
      return str.toString(); 
    }
接雨水（困难）
leetcode: https://leetcode.cn/problems/trapping-rain-water/
给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
[图片]
public int trap(int[] height) {
        
        int[] leftmax=new int[n];
        leftmax[0]=height[0];
        for(int i=1;i<n;++i){
            leftmax[i]=Math.max(leftmax[i-1],height[i]);
        }
        int[] rightmax=new int[n];
        rightmax[n-1]=height[n-1];
        for(int i=n-2;i>=0;--i){
            rightmax[i]=Math.max(rightmax[i+1],height[i]);
        }
        int ans=0;
        for(int i=0;i<n;++i){
            ans+=Math.min(leftmax[i],rightmax[i])-height[i];
        }
        return ans;

    }
找到字符串中所有字母异位词（中等）
leetcode: https://leetcode.cn/problems/find-all-anagrams-in-a-string/
给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。
[图片]
public List<Integer> findAnagrams(String s, String p) {
        List<Integer> ans = new ArrayList<>();
        //用时间换空间以及用空间换时间
        if(s.length()<p.length()){
            return ans;
        }
        int[] arr = new int[26];
        for (int i = 0; i < p.length(); i++) {
            arr[p.charAt(i)-'a']++;
        }
        for (int i = 0,j=0; j < s.length(); j++) {
            arr[s.charAt(j)-'a']--;
            while (arr[s.charAt(j)-'a']<0){
                arr[s.charAt(i)-'a']++;
                i++;
            }
            if(j-i+1==p.length()){
                ans.add(i);
            }
        }
        return ans;
    }
和为K的子数组（中等）
leetcode: https://leetcode.cn/problems/subarray-sum-equals-k/
给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。
子数组是数组中元素的连续非空序列。
[图片]
 public int subarraySum(int[] nums, int k) {
       int res=0,sum=0;
       Map<Integer,Integer> map=new HashMap<>();
       map.put(0,1);
       for(int i=0;i<nums.length;++i){
        sum+=nums[i];
        if(map.containsKey(sum-k)){
            res+=map.get(sum-k);
        }
        map.put(sum,map.getOrDefault(sum,0)+1);
       }
       return res;
    }
滑动窗口最大值(困难）
给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。
返回 滑动窗口中的最大值 。
public int[] maxSlidingWindow(int[] nums, int k) {
        if(k==0||nums==null) return new int[]{};
        ArrayDeque<Integer> deque=new ArrayDeque<>();
        int n=nums.length;
        int[] res=new int[n+1-k];
        int index=0;
        for(int i=0;i<n;++i){
            if(!deque.isEmpty()&&deque.peek()==i-k){
                deque.poll();
            }
            while(!deque.isEmpty()&&nums[deque.peekLast()]<=nums[i]){
                deque.pollLast();
            }
            deque.offer(i);
            if(i>=k-1){
                res[index]=nums[deque.peek()];
                index++;
            }
        }
        return res;
    }

public int[] maxSlidingWindow(int[] nums, int k) {
    if (k == 0 || nums == null) return new int[]{};
    int n = nums.length;
    int[] res = new int[n - k + 1];
    int index = 0;
    Queue<Integer> queue = new LinkedList<>();
    int currentMax = Integer.MIN_VALUE;

    // 初始化第一个窗口
    for (int i = 0; i < k; i++) {
        queue.offer(nums[i]);
        currentMax = Math.max(currentMax, nums[i]);
    }
    res[index++] = currentMax;

    // 滑动窗口
    for (int i = k; i < n; i++) {
        // 移出窗口左边界的元素
        int out = queue.poll();
        // 移入窗口右边界的元素
        queue.offer(nums[i]);

        // 若移出的是最大值，重新找最大值（最坏O(k)）
        if (out == currentMax) {
            currentMax = Integer.MIN_VALUE;
            for (int num : queue) {
                currentMax = Math.max(currentMax, num);
            }
        } else {
            // 否则只需比较新元素和当前最大值
            currentMax = Math.max(currentMax, nums[i]);
        }
        res[index++] = currentMax;
    }
    return res;
}
最小覆盖子串(困难）
给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。
注意：
- 对于 t 中重复字符，我们寻找的子字符串中该字符数量必须不少于 t 中该字符数量。
- 如果 s 中存在这样的子串，我们保证它是唯一的答案。
class Solution {
    public String minWindow(String s, String t) {
         int slen=s.length(),tlen=t.length();
         if(slen==0||tlen==0||slen<tlen) return "";
         char[] sarr=s.toCharArray();
         char[] tarr=t.toCharArray();
         int[] sWind=new int[128];
         int[] tWind=new int[128];
         for(char c:tarr){
            tWind[c]++;
         }
         int distance=0;
         int right=0;
         int start=0;
         int left=0;
         int minlen=slen+1;
         while(right<slen){
            if(tWind[sarr[right]]==0){
                right++;
                continue;
            }
            if(sWind[sarr[right]]<tWind[sarr[right]]) distance++;
            sWind[sarr[right]]++;
            right++;
            while(distance==tlen){
                if(right-left<minlen){
                    minlen=right-left;
                    start=left;
                }
                if(tWind[sarr[left]]==0){
                    left++;
                    continue;
                }
                if(tWind[sarr[left]]==sWind[sarr[left]]){
                    distance--;
                }
                sWind[sarr[left]]--;
                left++;
            }
           
         }
          if(minlen==slen+1) return "";
        return s.substring(start,start+minlen);
    }
}
轮转数组（中等）
leetcode: https://leetcode.cn/problems/rotate-array/
给定一个整数数组 nums，将数组中的元素向右轮转 k 个位置，其中 k 是非负数
public void rotate(int[] nums, int k) {
        //三次翻转实现
        int n = nums.length;
        k = k % n;
        reverseAll(nums);
        reverse(nums, 0, k-1);
        reverse(nums, k, n - 1);

    }

    void reverse(int[] nums, int l, int r) {
        while (l < r) {
            int temp = nums[l];
            nums[l] = nums[r];
            nums[r] = temp;
            l++;
            r--;
        }
    }

    void reverseAll(int[] nums) {
        int i = 0, j = nums.length - 1;
        while (i < j) {
            int temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
            i++;
            j--;
        }
    }
缺失的第一个正数（困难）
leetcode: https://leetcode.cn/problems/first-missing-positive/
给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。
请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。
public int firstMissingPositive(int[] nums) {
        int len=nums.length;
        
        for(int m=0;m<len;++m){
            while(0<=nums[m]-1&&nums[m]-1<len&&nums[m]!=nums[nums[m]-1]){
            int tem=nums[nums[m]-1];
            nums[nums[m]-1]=nums[m];
            nums[m]=tem;
        }
        }
        
        for(int i=0;i<len;++i){
            if(nums[i]!=i+1){
                return i+1;
            }
        }
        return len+1;
    }
矩阵置零（中等）
leetcode: https://leetcode.cn/problems/set-matrix-zeroes/
给定一个 m x n 的矩阵，如果一个元素为 0 ，则将其所在行和列的所有元素都设为 0 。请使用 原地 算法。
public void setZeroes(int[][] matrix) {
        int m=matrix.length,n=matrix[0].length;
        boolean[] b1=new boolean[m];
        boolean[] b2=new boolean[n];
        for(int i=0;i<m;++i){
           for(int j=0;j<n;++j){
            if(matrix[i][j]==0){
                b1[i]=true;
                b2[j]=true;
            }
           } 
        }
        for(int i=0;i<m;++i){
           for(int j=0;j<n;++j){
            if(b1[i]||b2[j]){
                matrix[i][j]=0;
            }

           } 
        }

    }
螺旋矩阵（中等）
leetcode: https://leetcode.cn/problems/spiral-matrix/
给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        int m=matrix.length,n=matrix[0].length;
        List<Integer> ans=new ArrayList<>();
        int t=0,b=m-1,l=0,r=n-1;
        while(t<=b&&l<=r){
            for(int j=l;j<=r;++j){
                ans.add(matrix[t][j]);
            }
            t++;
            for(int i=t;i<=b;++i){
                ans.add(matrix[i][r]);
            }
            r--;
            if(t>b||r<l) break;
            for(int j=r;j>=l;--j){
                ans.add(matrix[b][j]);
            }
            b--;
            for(int i=b;i>=t;--i){
                ans.add(matrix[i][l]);
            }
            l++;
        }
        return ans;
    }
}
两两交换链表中的节点（中等）
leetcode: https://leetcode.cn/problems/swap-nodes-in-pairs/
给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。
[图片]
public ListNode swapPairs(ListNode head) {
        ListNode dummy=new ListNode(0,head);
        ListNode tem=dummy;
        while(tem.next!=null&&tem.next.next!=null){
            ListNode cur=tem.next;
            ListNode next=cur.next;
            tem.next=next;
            cur.next=next.next;
            next.next=cur;
            tem=cur;
        }
        return dummy.next;
    }
K个一组翻转链表（困难）
leetcode: https://leetcode.cn/problems/reverse-nodes-in-k-group/
给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。
k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。
你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。
public ListNode reverseKGroup(ListNode head, int k) {
       ListNode dummy=new ListNode(0,head);
       ListNode tem=dummy;
       while(tem.next!=null){
        ListNode node=reverseListnode(tem,k);
        if(node==null){
            reverseListnode(tem,k);
            break;
        }else{
            tem=node;
        }
       }
       return dummy.next; 
    }
    ListNode reverseListnode(ListNode pre,int k){
        ListNode cur=pre.next;
        int i=1;
        for(;i<k&&cur!=null&&cur.next!=null;++i){
            ListNode next=cur.next;
            cur.next=next.next;
            next.next=pre.next;
            pre.next=next;
        }
        return i==k?cur:null;
    }
随机链表的复制（中等）
leetcode: https://leetcode.cn/problems/copy-list-with-random-pointer/
给你一个长度为 n 的链表，每个节点包含一个额外增加的随机指针 random ，该指针可以指向链表中的任何节点或空节点。
构造这个链表的 深拷贝。 深拷贝应该正好由 n 个 全新 节点组成，其中每个新节点的值都设为其对应的原节点的值。新节点的 next 指针和 random 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。复制链表中的指针都不应指向原链表中的节点 。
例如，如果原链表中有 X 和 Y 两个节点，其中 X.random --> Y 。那么在复制链表中对应的两个节点 x 和 y ，同样有 x.random --> y 。
返回复制链表的头节点。
用一个由 n 个节点组成的链表来表示输入/输出中的链表。每个节点用一个 [val, random_index] 表示：
- val：一个表示 Node.val 的整数。
- random_index：随机指针指向的节点索引（范围从 0 到 n-1）；如果不指向任何节点，则为  null 。
你的代码 只 接受原链表的头节点 head 作为传入参数。
public Node copyRandomList(Node head) {
        if(head==null) return null;
        Map<Node,Node> hash=new HashMap<>();
        Node tem=head;
        while(tem!=null){
            hash.put(tem,new Node(tem.val));
            tem=tem.next;
        }
        tem=head;
        while(tem!=null){
            Node node=hash.get(tem);
            node.next=hash.get(tem.next);
            node.random=hash.get(tem.random);
            tem=tem.next;
        }
        return hash.get(head);
    }
合并K个升序链表（困难）
leetcode: https://leetcode.cn/problems/merge-k-sorted-lists/
给你一个链表数组，每个链表都已经按升序排列。
请你将所有链表合并到一个升序链表中，返回合并后的链表
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if(lists==null||lists.length==0) return null;
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> (a.val - b.val));
        //最小堆 堆上的为当前的最小值
        for (ListNode list : lists) {
            if(list!=null) pq.offer(list);
        }
        while(!pq.isEmpty()){
            ListNode tem=pq.poll();
            cur.next=tem;
            cur=cur.next;
            if(tem.next!=null){
                pq.offer(tem.next);
            }
        }
        return dummy.next;
    }   
}
 public ListNode mergeKLists(ListNode[] lists) {
        int n=lists.length;
        if(n==0||lists==null) return null;
        return mergeAll(lists,0,n-1);
    }
    ListNode mergeAll(ListNode[] lists,int left,int right){
        if(left>right) return null;
        if(left==right) return lists[left];
        int mid=(right-left)/2+left;
        ListNode l=mergeAll(lists,left,mid);
        ListNode r=mergeAll(lists,mid+1,right);
        return mergeTwo(l,r);
    }
    ListNode mergeTwo(ListNode l1,ListNode l2){
        ListNode dummy=new ListNode(0);
        ListNode tem=dummy;
        while(l1!=null&&l2!=null){
            if(l1.val<=l2.val){
                tem.next=l1;
                l1=l1.next;
            }else{
                tem.next=l2;
                l2=l2.next;
            }
            tem=tem.next;
        }
        tem.next=l1==null?l2:l1;
        return dummy.next;
    }
迭代法遍历二叉树
前序遍历
给你一个二叉树的根节点 root ， 检查它是否轴对称。
public class TreeTraversal {
    // 前序遍历：根→左→右
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        
        Deque<TreeNode> stack = new LinkedList<>();
        stack.push(root); // 根节点先入栈
        
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop(); // 弹出并访问根节点
            res.add(node.val);
            
            // 右子树先压栈（后访问），左子树后压栈（先访问）
            if (node.right != null) {
                stack.push(node.right);
            }
            if (node.left != null) {
                stack.push(node.left);
            }
        }
        return res;
    }
}

//注意这里的顺序 先访问的后压栈

// 中序遍历：左→根→右
public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    
    Deque<TreeNode> stack = new LinkedList<>();
    TreeNode cur = root; // 指针跟踪当前节点
    
    while (cur != null || !stack.isEmpty()) {
        // 1. 遍历到左子树最底层，所有左节点压栈
        while (cur != null) {
            stack.push(cur);
            cur = cur.left;
        }
        // 2. 弹出栈顶（左子树最底层节点，即当前根），访问它
        TreeNode node = stack.pop();
        res.add(node.val);
        // 3. 处理右子树（重复左遍历流程）
        cur = node.right;
    }
    return res;
}

// 后序遍历：左→右→根（双栈法）
public List<Integer> postorderTraversal(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    
    Deque<TreeNode> stack1 = new LinkedList<>();
    Deque<TreeNode> stack2 = new LinkedList<>();
    stack1.push(root); // 根节点先入栈1
    
    while (!stack1.isEmpty()) {
        TreeNode node = stack1.pop();
        stack2.push(node); // 栈1弹出的节点压入栈2
        
        // 栈1：左子树先压，右子树后压 → 弹出顺序：根→右→左
        if (node.left != null) {
            stack1.push(node.left);
        }
        if (node.right != null) {
            stack1.push(node.right);
        }
    }
    
    // 栈2弹出顺序：左→右→根
    while (!stack2.isEmpty()) {
        res.add(stack2.pop().val);
    }
    return res;
}
二叉树的直径（简单）
leetcode: https://leetcode.cn/problems/diameter-of-binary-tree/
给你一棵二叉树的根节点，返回该树的 直径 。
二叉树的 直径 是指树中任意两个节点之间最长路径的 长度 。这条路径可能经过也可能不经过根节点 root 。
两节点之间路径的 长度 由它们之间边数表示。
class Solution {
    int ans;
    public int diameterOfBinaryTree(TreeNode root) {
        ans=0;
        dfs(root);
        return ans;
    }
    int dfs(TreeNode root){
        if(root==null) return 0;
        int left=dfs(root.left);
        int right=dfs(root.right);
        ans=Math.max(ans,left+right);
        return Math.max(left,right)+1;
    }
}
二叉树的层序遍历（中等）
leetcode: https://leetcode.cn/problems/binary-tree-level-order-traversal/
给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。
public List<List<Integer>> levelOrder(TreeNode root) {
        
        List<List<Integer>> res=new ArrayList<>(); 
        Deque<TreeNode> que=new ArrayDeque<>();
        if(root==null) return res;
        que.offer(root);
        while(!que.isEmpty()){
            int size=que.size();
            List<Integer> list=new ArrayList<>();
            for(int i=0;i<size;++i){
                TreeNode temp=que.poll();
                list.add(temp.val);
                if(temp.left!=null){
                que.add(temp.left);
                }
                if(temp.right!=null){
                 que.add(temp.right);
                }
            }
            res.add(list);
        }
        return res;  
    }
将有序数组转换为二叉搜索树（简单）
leetcode: https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/
给你一个整数数组 nums ，其中元素已经按 升序 排列，请你将其转换为一棵 平衡 二叉搜索树。
 public TreeNode sortedArrayToBST(int[] nums) {
        return reverseNumsToTree(nums,0,nums.length-1);
    }
    TreeNode reverseNumsToTree(int[] nums,int left,int right){
        if(left>right) return null;
        int mid=(left+right)/2;
        TreeNode root=new TreeNode(nums[mid]);
        root.left=reverseNumsToTree(nums,left,mid-1);
        root.right=reverseNumsToTree(nums,mid+1,right);
        return root;
        
    }
二叉搜索树中第K小的元素（中等）
leetcode: https://leetcode.cn/problems/kth-smallest-element-in-a-bst/
给定一个二叉搜索树的根节点 root ，和一个整数 k ，请你设计一个算法查找其中第 k 小的元素（从 1 开始计数）。
class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Stack<TreeNode> stack = new Stack<>();
        TreeNode cur = root;
        int count = 0; // 记录遍历到的节点数（从0开始）

        while (cur != null || !stack.isEmpty()) {
            // 步骤1：一路压入左子节点（直到左子树为空）
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }

            // 步骤2：弹出栈顶（访问当前节点）
            cur = stack.pop();
            count++; // 计数+1

            // 步骤3：找到第k个节点，直接返回
            if (count == k) {
                return cur.val;
            }

            // 步骤4：遍历当前节点的右子树
            cur = cur.right;
        }

        // 题目保证k有效，此处仅为容错
        return -1;
    }
}
class Solution {
    int ans;
    int i;
    public int kthSmallest(TreeNode root, int k) {
        ans=Integer.MAX_VALUE;
        i=k;
        dfs(root);
        return ans;
    }
    void dfs(TreeNode root){
        if(root==null) return;
        dfs(root.left);
        i--; 
        if(i==0) {
            ans=Math.min(root.val,ans);
            return;
            }
        dfs(root.right);
    }
}

class Solution {
    // 存储中序遍历结果
    private List<Integer> inorderList = new ArrayList<>();

    public int kthSmallest(TreeNode root, int k) {
        // 递归中序遍历
        inorderTraversal(root);
        // 边界：k超出节点总数（题目假设k有效，可省略）
        if (k > inorderList.size()) return -1;
        // 返回第k小（列表下标k-1）
        return inorderList.get(k - 1);
    }

    // 中序遍历：左→根→右
    private void inorderTraversal(TreeNode node) {
        if (node == null) return;
        // 遍历左子树
        inorderTraversal(node.left);
        // 访问根节点，加入列表
        inorderList.add(node.val);
        // 遍历右子树
        inorderTraversal(node.right);
    }
}
二叉树的右视图（中等）
leetcode: https://leetcode.cn/problems/binary-tree-right-side-view/
给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
 public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res=new ArrayList<>();
        dfs(root,res,0);
        return res;
    }
    void dfs(TreeNode root,List<Integer> res,int index){
        if(root==null) return;
        if(index==res.size()){
            res.add(root.val);
        }
        dfs(root.right,res,index+1);
        dfs(root.left,res,index+1);

    }
二叉树展开为链表（中等）
leetcode: https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/
给你二叉树的根结点 root ，请你将它展开为一个单链表：
- 展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
- 展开后的单链表应该与二叉树 先序遍历 顺序相同。
[图片]
   public void flatten(TreeNode root) {
        TreeNode tem=root;
        while(tem!=null){
            if(tem.left!=null){
                TreeNode rightmost=tem.left;
                while(rightmost.right!=null){
                    rightmost=rightmost.right;
                }
                rightmost.right=tem.right;
                tem.right=tem.left;
                tem.left=null;
            }
            tem=tem.right;
        }
    }
路径总和III（中等）
leetcode: https://leetcode.cn/problems/path-sum-iii/
给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。
路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。
[图片]
class Solution {
    Map<Long,Integer> prex;
    public int pathSum(TreeNode root, int targetSum) {
        if(root==null) return 0;
        prex=new HashMap<>();
        prex.put(0L,1);
        return dfs(root,targetSum,0L);
    }
    int dfs(TreeNode root,int targetSum,long sum){
        if(root==null) return 0;
        sum+=root.val;
        int ret=prex.getOrDefault(sum-targetSum,0);
        prex.put(sum,prex.getOrDefault(sum,0)+1);
        ret+=dfs(root.left,targetSum,sum);
        ret+=dfs(root.right,targetSum,sum);
        prex.put(sum,prex.get(sum)-1);
        return ret;
    }
}
二叉树中的最大路径和（困难）
leetcode: https://leetcode.cn/problems/binary-tree-maximum-path-sum/
二叉树中的 路径 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。
路径和 是路径中各节点值的总和。
给你一个二叉树的根节点 root ，返回其 最大路径和 。
class Solution {
    int ans;
    public int maxPathSum(TreeNode root) {
        ans=Integer.MIN_VALUE;
        dfs(root);
        return ans;
    }
    int dfs(TreeNode root){
        if(root==null) return 0;
        int left=Math.max(dfs(root.left),0);
        int right=Math.max(dfs(root.right),0);
        int tem=Math.max(left,right)+root.val;
        ans=Math.max(ans,left+right+root.val);
        return tem;
    }
}
腐烂的橘子（中等）
leetcode: https://leetcode.cn/problems/rotting-oranges/
在给定的 m x n 网格 grid 中，每个单元格可以有以下三个值之一：
- 值 0 代表空单元格；
- 值 1 代表新鲜橘子；
- 值 2 代表腐烂的橘子。
每分钟，腐烂的橘子 周围 4 个方向上相邻 的新鲜橘子都会腐烂。
返回 直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能，返回 -1 。
public int orangesRotting(int[][] grid) {
    int m = grid.length;
    int n = grid[0].length;
    int[][] dirs = {{0,1}, {0,-1}, {1,0}, {-1,0}};
    Deque<int[]> queue = new ArrayDeque<>();
    int fresh = 0;  // 统计新鲜橘子数量（替代all和bad的复杂逻辑）
    
    // 初始化：收集所有腐烂橘子，统计新鲜橘子数量
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 2) {
                queue.offer(new int[]{i, j});  // 所有初始腐烂橘子入队（多源）
            } else if (grid[i][j] == 1) {
                fresh++;  // 记录新鲜橘子总数
            }
        }
    }
    
    int time = 0;  // 时间（分钟）
    // 多源BFS：每一层代表1分钟
    while (!queue.isEmpty() && fresh > 0) {
        int size = queue.size();  // 当前层的腐烂橘子数量（同一分钟内的感染源）
        time++;  // 进入下一分钟
        
        // 处理当前层所有腐烂橘子（同时感染）
        for (int i = 0; i < size; i++) {
            int[] cur = queue.poll();
            for (int[] dir : dirs) {
                int x = cur[0] + dir[0];
                int y = cur[1] + dir[1];
                // 感染新鲜橘子
                if (x >= 0 && x < m && y >= 0 && y < n && grid[x][y] == 1) {
                    grid[x][y] = 2;  // 标记为腐烂
                    fresh--;  // 新鲜橘子数量减少
                    queue.offer(new int[]{x, y});  // 加入队列，作为下一分钟的感染源
                }
            }
        }
    }
    
    // 若还有新鲜橘子未被感染，返回-1；否则返回时间
    return fresh == 0 ? time : -1;
}
分割回文串（中等）
leetcode: https://leetcode.cn/problems/palindrome-partitioning/
给你一个字符串 s，请你将 s 分割成一些 子串，使每个子串都是 回文串 。返回 s 所有可能的分割方案。
public List<List<String>> partition(String s) {
        List<List<String>> res=new ArrayList<>();
        List<String> list=new ArrayList<>();
        dfs(res,list,0,s);
        return res;
    }
    void dfs(List<List<String>> res,List<String> list,int index,String s){
        if(index==s.length()){
            res.add(new ArrayList<>(list));
            return;
        }
        for(int i=index;i<s.length();++i){
            if(ifPar(s,index,i)){
                list.add(s.substring(index,i+1));
                dfs(res,list,i+1,s);
                list.removeLast();
            }
        }
    }
    boolean ifPar(String s,int start,int end){
        for(int i=start,j=end;i<j;i++,j--){
            if(s.charAt(i)!=s.charAt(j)){
                return false;
            }
        }
        return true;
    }
N皇后（困难）
leetcode: https://leetcode.cn/problems/n-queens/
按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。
n 皇后问题 研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。
给你一个整数 n ，返回所有不同的 n 皇后问题 的解决方案。
每一种解法包含一个不同的 n 皇后问题 的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。
[图片]
public List<List<String>> solveNQueens(int n) {
        List<List<String>> resList=new ArrayList<>();
        char[][] chessboard=new char[n][n];
        for(char[] c:chessboard){
            Arrays.fill(c,'.');
        }
        backtracking(chessboard,resList,n,0);
        return resList;
    }
    void backtracking(char[][] chessboard,List<List<String>> resList,int n,int index){
        if(index==n){
            resList.add(arrayToList(chessboard));
            return;
        }
        for(int i=0;i<n;++i){
            if(isValid(chessboard,index,i,n)){
                chessboard[index][i]='Q';
                backtracking(chessboard,resList,n,index+1);
                chessboard[index][i]='.';
            }
        }
    }
    boolean isValid(char[][] chessboard,int row,int col,int n){
        //是从遍历到最深处时开始不断向上进行返回 所以一开始的时候 row和col是由大到小的
        //判断某一列 同一行会遍历 所以不需要进行相应的判断
        for(int i=0;i<row;++i){
            if(chessboard[i][col]=='Q'){
                return false;
            }
        }
        //判断45%的方向
        for(int i=row-1,j=col-1;i>=0&&j>=0;--i,--j){
            if(chessboard[i][j]=='Q'){
                return false;
            }
        }
        for(int i=row-1,j=col+1;i>=0&&j<n;--i,++j){
            if(chessboard[i][j]=='Q'){
                return false;
            }
        }
        return true;
    }
    List<String> arrayToList(char[][] chessboard){
        List<String> list=new ArrayList<>();
        for(char[] c:chessboard){
            list.add(String.copyValueOf(c));
        }
        return list;
    }
搜索插入位置（简单）
leetcode: https://leetcode.cn/problems/search-insert-position/
给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
请必须使用时间复杂度为 O(log n) 的算法。
public int searchInsert(int[] nums, int target) {
       int n=nums.length;
       int left=0,right=n-1;
       while(left<=right){
        int mid=left+(right-left)/2;
        if(nums[mid]==target) return mid;
        else if(nums[mid]>target){
            right=mid-1;
        }else{
            left=mid+1;
        }
       }
       return left; 
    }
寻找旋转排序数组中的最小值（中等）
leetcode: https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/
已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次 旋转 后，得到输入数组。例如，原数组 nums = [0,1,2,4,5,6,7] 在变化后可能得到：
- 若旋转 4 次，则可以得到 [4,5,6,7,0,1,2]
- 若旋转 7 次，则可以得到 [0,1,2,4,5,6,7]
注意，数组 [a[0], a[1], a[2], ..., a[n-1]] 旋转一次 的结果为数组 [a[n-1], a[0], a[1], a[2], ..., a[n-2]] 。
给你一个元素值 互不相同 的数组 nums ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 最小元素 。
你必须设计一个时间复杂度为 O(log n) 的算法解决此问题

//没有target 所以 right不能直接-1 而左侧不可能是最小值所以可以+1
public int findMin(int[] nums) {
    int n = nums.length;
    // 常规二分：闭区间 [left, right] 初始化
    int left = 0, right = n - 1;
    
    while (left <= right) {
        // 优化：若区间已升序，直接返回左边界（提前终止）
        if (nums[left] <= nums[right]) {
            return nums[left];
        }
        
        int mid = left + (right - left) / 2;
        // 锚点：nums[n-1] 区分左右段
        if (nums[mid] <= nums[n-1]) {
            // mid在右段 → 最小值在 [left, mid]
            right = mid;
        } else {
            // mid在左段 → 最小值在 [mid+1, right]
            left = mid + 1;
        }
    }
    // 循环结束时left=right，返回任意一个即可
    return nums[left];
}


public int findMin(int[] nums) {
       int n=nums.length;
       int left=-1,right=n-1;
        while(left+1<right){
            int mid=left+(right-left)/2;
            if(nums[mid]<=nums[n-1]){
                right=mid;
            }else{
                left=mid;
            }
        }
        return nums[right];
    }
寻找两个正序数组的中位数（困难）
leetcode: https://leetcode.cn/problems/median-of-two-sorted-arrays/
给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
算法的时间复杂度应该为 O(log (m+n)) 。
 public double findMedianSortedArrays(int[] nums1, int[] nums2) {
      if(nums1.length>nums2.length){
        int[] temp=nums1;
        nums1=nums2;
        nums2=temp;
      }
      int m=nums1.length;
      int n=nums2.length;

      int totalLeft=(m+n+1)/2;
      //? 左边相对多一个值？
      int left=0;
      int right=m;
      while(left<right){
        int i=left+(right-left+1)/2;
        int j=totalLeft-i;
        if(nums1[i-1]>nums2[j]){
            right=i-1;
        }else{
            left=i;
        }
      }
      int i=left;
      int j=totalLeft-i;
      int leftMax1=i==0?Integer.MIN_VALUE:nums1[i-1];
      int rightMin1=i==m?Integer.MAX_VALUE:nums1[i];
      int leftMax2=j==0?Integer.MIN_VALUE:nums2[j-1];
      int rightMin2=j==n?Integer.MAX_VALUE:nums2[j];
      if((m+n)&1==1){
        return Math.max(leftMax1,leftMax2);
      }else{
        return (double)((Math.max(leftMax1,leftMax2))+Math.min(rightMin1,rightMin2))/2;
      }
    }
每日温度（中等）
leetcode: https://leetcode.cn/problems/daily-temperatures/
给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替
  public int[] dailyTemperatures(int[] temperatures) {
        int n=temperatures.length;
        int[] res=new int[n];
        Deque<Integer> stack=new ArrayDeque<>();
        for(int i=0;i<n;++i){
            while(!stack.isEmpty()&&temperatures[i]>temperatures[stack.peek()]){
                int j=stack.pop();
                res[j]=i-j;
            }
            stack.push(i);
        }
        return res;
    }
前K个高频元素（中等）
leetcode: https://leetcode.cn/problems/top-k-frequent-elements/
给你一个整数数组 nums 和一个整数 k ，请你返回其中出现频率前 k 高的元素。你可以按 任意顺序 返回答案。
[图片]
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer,Integer> map=new HashMap<>();
        for(int num:nums){
            map.put(num,map.getOrDefault(num,0)+1);
        }
        int len=nums.length;
        int[] ans=new int[k];
        PriorityQueue<int[]> pq=new PriorityQueue<>((pair1,pair2)->pair2[1]-pair1[1]);
        for(Map.Entry<Integer,Integer> entry:map.entrySet()){
            pq.add(new int[]{entry.getKey(),entry.getValue()});
        }
        for(int i=0;i<k;++i){
            ans[i]=pq.poll()[0];
        }
        return ans;
    }
}
public int[] topKFrequent(int[] nums, int k) {
      int min=nums[0],max=min;
      for(int m:nums){
        min=Math.min(min,m);
        max=Math.max(max,m);
      }
      int[] arr=new int[max-min+1];
      int maxCnt=0;
     for(int m:nums){
        arr[max-m]++;
        maxCnt=Math.max(maxCnt,arr[max-m]);
     }
     List<Integer>[] buckets=new ArrayList[maxCnt+1];
     Arrays.setAll(buckets,i->new ArrayList<>());
     for(int i=max;i>=min;--i){
        buckets[arr[max-i]].add(i);
     }
     int[] ans=new int[k];
     int j=0;
     for(int i=maxCnt;i>=0&&j<k;--i){
        for(int m:buckets[i]){
            ans[j++]=m;
        }
     }
     return ans;
    }
}
数据流的中位数（困难）
leetcode: https://leetcode.cn/problems/find-median-from-data-stream/
中位数是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。
- 例如 arr = [2,3,4] 的中位数是 3 。
- 例如 arr = [2,3] 的中位数是 (2 + 3) / 2 = 2.5 。
实现 MedianFinder 类:
- MedianFinder() 初始化 MedianFinder 对象。
- void addNum(int num) 将数据流中的整数 num 添加到数据结构中。
- double findMedian() 返回到目前为止所有元素的中位数。与实际答案相差 10-5 以内的答案将被接受。
class MedianFinder {

    private final PriorityQueue<Integer> right=new PriorityQueue<>();
    private final PriorityQueue<Integer> left=new PriorityQueue<>((a,b)->(b-a));

    public MedianFinder() {
        
    }
    
    public void addNum(int num) {
        if(left.size()==right.size()){
            right.offer(num);
            left.offer(right.poll());
        }else{
            left.offer(num);
            right.offer(left.poll());
        }
    }
    
    public double findMedian() {
        if(left.size()>right.size()){
            return left.peek();
        }
        return (left.peek()+right.peek())/2.0;
    }
}
划分字母区间（中等）
leetcode: https://leetcode.cn/problems/partition-labels/
给你一个字符串 s 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。例如，字符串 "ababcc" 能够被分为 ["abab", "cc"]，但类似 ["aba", "bcc"] 或 ["ab", "ab", "cc"] 的划分是非法的。
注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 s 。
返回一个表示每个字符串片段的长度的列表。
public List<Integer> partitionLabels(String s) {
        List<Integer> res=new ArrayList<>();
        int[] hash=new int[26];
        int n=s.length();
        for(int i=0;i<n;++i){
            int index=s.charAt(i)-'a';
            hash[index]=i;
        }
        int start=0,end=0;
        for(int i=0;i<n;++i){
            end=Math.max(end,hash[s.charAt(i)-'a']);
            if(i==end){
                res.add(end-start+1);
                start=end+1;
            }
        }
        return res;
    }
爬楼梯（简单）
leetcode: https://leetcode.cn/problems/climbing-stairs/
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
public int climbStairs(int n) {
        int m=1,t=1;
        for(int i=1;i<n;++i){
            int tem=m+t;
            m=t;
            t=tem;
            
        }
        return t;
    }
杨辉三角（简单）
leetcode: https://leetcode.cn/problems/pascals-triangle/
给定一个非负整数 numRows，生成「杨辉三角」的前 numRows 行。
在「杨辉三角」中，每个数是它左上方和右上方的数的和。
[图片]
 public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> res=new ArrayList<>();
        for(int i=0;i<numRows;++i){
        List<Integer> list=new ArrayList<>();
            for(int j=0;j<=i;++j){
                if(j==0||j==i){
                    list.add(1);
                }else{
                    list.add(res.get(i-1).get(j-1)+res.get(i-1).get(j));
                }
            }
            res.add(list);
        }
        return res;
    }
分割等和子集（中等）
leetcode: https://leetcode.cn/problems/partition-equal-subset-sum/
给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。
[图片]
class Solution {
    public boolean canPartition(int[] nums) {
        int n=nums.length;
        int sum=0,max=0;
        for(int num:nums){
            sum+=num;
            max=Math.max(max,num);
        }
        int target=sum/2;
        if(max>target||sum%2!=0) return false;
        int[] dp=new int[target+1];
        for(int num:nums){
            for(int i=target;i>=num;--i){
                dp[i]=Math.max(dp[i],dp[i-num]+num);
            }
            if(dp[target]==target) return true;
        }
        return dp[target]==target;
    }
}
最长有效括号（困难）
leetcode: https://leetcode.cn/problems/longest-valid-parentheses/
给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号 子串 的长度。
左右括号匹配，即每个左括号都有对应的右括号将其闭合的字符串是格式正确的，比如 "(()())"。
class Solution {
    public int longestValidParentheses(String s) {
        int n = s.length();
        if (n < 2) return 0; // 长度<2不可能有有效子串
        
        int[] dp = new int[n]; // dp[i]：以i结尾的最长有效长度
        int maxLen = 0;
        
        for (int i = 1; i < n; i++) {
            // 只有右括号结尾才可能有有效子串
            if (s.charAt(i) == ')') {
                // 情况1：前一个是左括号，直接匹配
                if (s.charAt(i-1) == '(') {
                    dp[i] = (i >= 2 ? dp[i-2] : 0) + 2;
                } 
                // 情况2：前一个是右括号，嵌套匹配
                else if (i - dp[i-1] > 0 && s.charAt(i - dp[i-1] - 1) == '(') {
                    // 加上start-1位置的有效长度（如果存在）
                    dp[i] = dp[i-1] + 2 + (i - dp[i-1] >= 2 ? dp[i - dp[i-1] - 2] : 0);
                }
                // 更新最大长度
                maxLen = Math.max(maxLen, dp[i]);
            }
            // 左括号结尾，dp[i]默认0，无需处理
        }
        return maxLen;
    }
}
 public int longestValidParentheses(String s) {
       Deque<Integer> stack=new LinkedList<>();
       int ans=0;
       stack.push(-1);
       for(int i=0;i<s.length();++i){
        if(s.charAt(i)=='('){
            stack.push(i);
        }else{
            stack.pop();
            if(stack.isEmpty()){
                stack.push(i);
            }else{
                ans=Math.max(ans,i-stack.peek());
            }
        }
       }
       return ans; 
    }
最长公共子序列（中等）
leetcode: https://leetcode.cn/problems/longest-common-subsequence/
给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 0 。
一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
- 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。
 public int longestCommonSubsequence(String text1, String text2) {
       int m=text1.length(),n=text2.length();
       int[][] dp=new int[m+1][n+1];
       for(int i=0;i<=m;++i){
        dp[i][0]=0;
       }
       for(int i=0;i<=n;++i){
        dp[0][i]=0;
       }
       for(int i=1;i<=m;++i){
        char c1=text1.charAt(i-1);
        for(int j=1;j<=n;++j){
            char c2=text2.charAt(j-1);
            if(c1==c2){
                dp[i][j]=dp[i-1][j-1]+1;
            }else{
                dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
            }
        }
       }
       return dp[m][n];
    }
编辑距离（中等）
leetcode: https://leetcode.cn/problems/edit-distance/
给你两个单词 word1 和 word2， 请返回将 word1 转换成 word2 所使用的最少操作数  。
你可以对一个单词进行如下三种操作：
- 插入一个字符
- 删除一个字符
- 替换一个字符
public int minDistance(String word1, String word2) {
      int m=word1.length(),n=word2.length();
      if(m*n==0) return n+m;
      int[][] dp=new int[m+1][n+1];
      for(int i=1;i<=m;++i){
        dp[i][0]=i;
      
      }
      for(int i=1;i<=n;++i){
        dp[0][i]=i;
      }
      for(int i=1;i<=m;++i){
        char c1=word1.charAt(i-1);
        for(int j=1;j<=n;++j){
            char c2=word2.charAt(j-1);
            if(c1==c2) dp[i][j]=dp[i-1][j-1];
            else dp[i][j]=(Math.min(Math.min(dp[i-1][j-1],dp[i-1][j]),dp[i][j-1]))+1;
        }
      }
      return dp[m][n];   
    }


