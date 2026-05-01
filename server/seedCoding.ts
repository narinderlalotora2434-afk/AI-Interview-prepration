// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProblems = [
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    difficulty: "Easy",
    category: "Stack",
    tags: JSON.stringify(["String", "Stack"]),
    companies: JSON.stringify(["Amazon", "Microsoft", "Bloomberg", "Google"]),
    examples: JSON.stringify([
      { input: "s = \"()\"", output: "true", explanation: "" },
      { input: "s = \"()[]{}\"", output: "true", explanation: "" },
      { input: "s = \"(]\"", output: "false", explanation: "" }
    ]),
    constraints: JSON.stringify(["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."]),
    hints: JSON.stringify(["Use a stack to keep track of open brackets.", "When you see a close bracket, check if it matches the top of the stack."]),
    starterCode: JSON.stringify({
      JavaScript: "/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};",
      Python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        ",
      Java: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};"
    })
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: JSON.stringify(["Array", "Divide and Conquer", "Dynamic Programming"]),
    companies: JSON.stringify(["Amazon", "Apple", "Microsoft", "Google"]),
    examples: JSON.stringify([
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1", explanation: "The subarray [1] has the largest sum 1." }
    ]),
    constraints: JSON.stringify(["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"]),
    hints: JSON.stringify(["Try Kadane's algorithm. Keep track of the current subarray sum and the max sum seen so far."]),
    starterCode: JSON.stringify({
      JavaScript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nvar maxSubArray = function(nums) {\n    \n};",
      Python: "class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        ",
      Java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};"
    })
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    difficulty: "Easy",
    category: "Array",
    tags: JSON.stringify(["Array", "Dynamic Programming"]),
    companies: JSON.stringify(["Amazon", "Microsoft", "Bloomberg"]),
    examples: JSON.stringify([
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." }
    ]),
    constraints: JSON.stringify(["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"]),
    hints: JSON.stringify(["Keep track of the minimum price seen so far.", "Calculate the difference between the current price and the minimum price."]),
    starterCode: JSON.stringify({
      JavaScript: "/**\n * @param {number[]} prices\n * @return {number}\n */\nvar maxProfit = function(prices) {\n    \n};",
      Python: "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        ",
      Java: "class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};"
    })
  },
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "Easy",
    category: "Dynamic Programming",
    tags: JSON.stringify(["Math", "Dynamic Programming", "Memoization"]),
    companies: JSON.stringify(["Amazon", "Google", "Apple"]),
    examples: JSON.stringify([
      { input: "n = 2", output: "2", explanation: "There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps" },
      { input: "n = 3", output: "3", explanation: "There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step" }
    ]),
    constraints: JSON.stringify(["1 <= n <= 45"]),
    hints: JSON.stringify(["To reach step n, you can arrive from step n-1 or step n-2.", "This is similar to the Fibonacci sequence."]),
    starterCode: JSON.stringify({
      JavaScript: "/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    \n};",
      Python: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        ",
      Java: "class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};"
    })
  },
  {
    title: "Binary Tree Inorder Traversal",
    slug: "binary-tree-inorder-traversal",
    description: "Given the `root` of a binary tree, return the inorder traversal of its nodes' values.",
    difficulty: "Easy",
    category: "Tree",
    tags: JSON.stringify(["Stack", "Tree", "Depth-First Search", "Binary Tree"]),
    companies: JSON.stringify(["Amazon", "Microsoft", "Google"]),
    examples: JSON.stringify([
      { input: "root = [1,null,2,3]", output: "[1,3,2]", explanation: "" },
      { input: "root = []", output: "[]", explanation: "" }
    ]),
    constraints: JSON.stringify(["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"]),
    hints: JSON.stringify(["Recursive approach is trivial, could you do it iteratively?"]),
    starterCode: JSON.stringify({
      JavaScript: "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n/**\n * @param {TreeNode} root\n * @return {number[]}\n */\nvar inorderTraversal = function(root) {\n    \n};",
      Python: "# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\nclass Solution:\n    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:\n        ",
      Java: "class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    vector<int> inorderTraversal(TreeNode* root) {\n        \n    }\n};"
    })
  },
  {
    title: "Search in Rotated Sorted Array",
    slug: "search-in-rotated-sorted-array",
    description: "There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` `(1 <= k < nums.length)` such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (0-indexed). For example, `[0,1,2,4,5,6,7]` might be rotated at pivot index 3 and become `[4,5,6,7,0,1,2]`.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    difficulty: "Medium",
    category: "Binary Search",
    tags: JSON.stringify(["Array", "Binary Search"]),
    companies: JSON.stringify(["Amazon", "Microsoft", "Bloomberg", "LinkedIn"]),
    examples: JSON.stringify([
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4", explanation: "" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1", explanation: "" }
    ]),
    constraints: JSON.stringify(["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values of nums are unique.", "nums is an ascending array that is possibly rotated.", "-10^4 <= target <= 10^4"]),
    hints: JSON.stringify(["Find the pivot point where the rotation happened.", "Use binary search to determine which half is sorted."]),
    starterCode: JSON.stringify({
      JavaScript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar search = function(nums, target) {\n    \n};",
      Python: "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        ",
      Java: "class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};"
    })
  },
  {
    title: "Number of Islands",
    slug: "number-of-islands",
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    difficulty: "Medium",
    category: "Graph",
    tags: JSON.stringify(["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"]),
    companies: JSON.stringify(["Amazon", "Google", "Bloomberg", "Microsoft"]),
    examples: JSON.stringify([
      { input: "grid = [\n  [\"1\",\"1\",\"1\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"0\",\"0\"]\n]", output: "1", explanation: "" },
      { input: "grid = [\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"1\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"1\",\"1\"]\n]", output: "3", explanation: "" }
    ]),
    constraints: JSON.stringify(["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'."]),
    hints: JSON.stringify(["Treat the 2d grid map as an undirected graph and use DFS or BFS to find the connected components."]),
    starterCode: JSON.stringify({
      JavaScript: "/**\n * @param {character[][]} grid\n * @return {number}\n */\nvar numIslands = function(grid) {\n    \n};",
      Python: "class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        ",
      Java: "class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};"
    })
  },
  {
    title: "Merge Intervals",
    slug: "merge-intervals",
    description: "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    difficulty: "Medium",
    category: "Array",
    tags: JSON.stringify(["Array", "Sorting"]),
    companies: JSON.stringify(["Amazon", "Facebook", "Microsoft", "Bloomberg"]),
    examples: JSON.stringify([
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]." },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]", explanation: "Intervals [1,4] and [4,5] are considered overlapping." }
    ]),
    constraints: JSON.stringify(["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= starti <= endi <= 10^4"]),
    hints: JSON.stringify(["Sort the intervals by their start value.", "Iterate through the intervals and merge them if the current start is less than or equal to the previous end."]),
    starterCode: JSON.stringify({
      JavaScript: "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nvar merge = function(intervals) {\n    \n};",
      Python: "class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        ",
      Java: "class Solution {\n    public int[][] merge(int[][] intervals) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};"
    })
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: JSON.stringify(["Array", "Dynamic Programming", "Breadth-First Search"]),
    companies: JSON.stringify(["Amazon", "Microsoft", "Bloomberg"]),
    examples: JSON.stringify([
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
      { input: "coins = [2], amount = 3", output: "-1", explanation: "" }
    ]),
    constraints: JSON.stringify(["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"]),
    hints: JSON.stringify(["Can you break the problem into smaller subproblems?", "Let dp[i] be the minimum coins needed to make amount i."]),
    starterCode: JSON.stringify({
      JavaScript: "/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nvar coinChange = function(coins, amount) {\n    \n};",
      Python: "class Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        ",
      Java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}",
      "C++": "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};"
    })
  },
  {
    title: "LRU Cache",
    slug: "lru-cache",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.\n- `int get(int key)` Return the value of the key if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.",
    difficulty: "Medium",
    category: "Linked List",
    tags: JSON.stringify(["Hash Table", "Linked List", "Design", "Doubly-Linked List"]),
    companies: JSON.stringify(["Amazon", "Microsoft", "Facebook", "Google"]),
    examples: JSON.stringify([
      { input: "[\"LRUCache\", \"put\", \"put\", \"get\", \"put\", \"get\", \"put\", \"get\", \"get\", \"get\"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]", output: "[null, null, null, 1, null, -1, null, -1, 3, 4]", explanation: "" }
    ]),
    constraints: JSON.stringify(["1 <= capacity <= 3000", "0 <= key <= 10^4", "0 <= value <= 10^5", "At most 2 * 10^5 calls will be made to get and put."]),
    hints: JSON.stringify(["Use a Hash Map and a Doubly Linked List."]),
    starterCode: JSON.stringify({
      JavaScript: "/**\n * @param {number} capacity\n */\nvar LRUCache = function(capacity) {\n    \n};\n\n/** \n * @param {number} key\n * @return {number}\n */\nLRUCache.prototype.get = function(key) {\n    \n};\n\n/** \n * @param {number} key \n * @param {number} value\n * @return {void}\n */\nLRUCache.prototype.put = function(key, value) {\n    \n};",
      Python: "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass"
    })
  }
];

async function seed() {
  console.log("Seeding Coding Problems...");
  let count = 0;
  for (const p of sampleProblems) {
    const exists = await prisma.codingProblem.findUnique({ where: { slug: p.slug } });
    if (!exists) {
      const problem = await prisma.codingProblem.create({ data: p });
      
      const exArray = JSON.parse(p.examples);
      let inputStr = "dummy_input";
      let outputStr = "dummy_output";
      if (exArray.length > 0) {
        inputStr = exArray[0].input;
        outputStr = exArray[0].output;
      }
      
      await prisma.testCase.create({
        data: {
          problemId: problem.id,
          input: inputStr,
          expectedOutput: outputStr,
          isHidden: false
        }
      });
      count++;
    }
  }
  console.log(`Seeding complete. Added ${count} new problems.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// Forces TS Server Reload
