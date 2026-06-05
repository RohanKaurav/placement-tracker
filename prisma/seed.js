require("dotenv").config();
const {PrismaClient} = require("@prisma/client");
const {PrismaPg} = require("@prisma/adapter-pg");
const {Pool} = require("pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
});

const adapter =new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
});

const QUESTIONS = [
    // Easy Questions (10 Points)

{ title: "Two Sum", url: "https://leetcode.com/problems/two-sum", difficulty: "EASY", points: 10 },
{ title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses", difficulty: "EASY", points: 10 },
{ title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists", difficulty: "EASY", points: 10 },
{ title: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock", difficulty: "EASY", points: 10 },
{ title: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome", difficulty: "EASY", points: 10 },
{ title: "Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree", difficulty: "EASY", points: 10 },
{ title: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram", difficulty: "EASY", points: 10 },
 { title: "Binary Search", url: "https://leetcode.com/problems/binary-search", difficulty: "EASY", points: 10 },
{ title: "Flood Fill", url: "https://leetcode.com/problems/flood-fill", difficulty: "EASY", points: 10 },
{ title: "Lowest Common Ancestor of a Binary Search Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree", difficulty: "EASY", points: 10 },
{ title: "Balanced Binary Tree", url: "https://leetcode.com/problems/balanced-binary-tree", difficulty: "EASY", points: 10 },
{ title: "Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle", difficulty: "EASY", points: 10 },
{ title: "Implement Queue using Stacks", url: "https://leetcode.com/problems/implement-queue-using-stacks", difficulty: "EASY", points: 10 },
{ title: "First Bad Version", url: "https://leetcode.com/problems/first-bad-version", difficulty: "EASY", points: 10 },
{ title: "Ransom Note", url: "https://leetcode.com/problems/ransom-note", difficulty: "EASY", points: 10 },
{ title: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs", difficulty: "EASY", points: 10 },
{ title: "Longest Palindrome", url: "https://leetcode.com/problems/longest-palindrome", difficulty: "EASY", points: 10 },
{ title: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list", difficulty: "EASY", points: 10 },
{ title: "Majority Element", url: "https://leetcode.com/problems/majority-element", difficulty: "EASY", points: 10 },
{ title: "Add Binary", url: "https://leetcode.com/problems/add-binary", difficulty: "EASY", points: 10 },
{ title: "Diameter of Binary Tree", url: "https://leetcode.com/problems/diameter-of-binary-tree", difficulty: "EASY", points: 10 },
{ title: "Middle of the Linked List", url: "https://leetcode.com/problems/middle-of-the-linked-list", difficulty: "EASY", points: 10 },
{ title: "Maximum Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree", difficulty: "EASY", points: 10 },
{ title: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate", difficulty: "EASY", points: 10 },
{ title: "Meeting Rooms", url: "https://leetcode.com/problems/meeting-rooms", difficulty: "EASY", points: 10 },
{ title: "Roman to Integer", url: "https://leetcode.com/problems/roman-to-integer", difficulty: "EASY", points: 10 },
{ title: "Backspace String Compare", url: "https://leetcode.com/problems/backspace-string-compare", difficulty: "EASY", points: 10 },
{ title: "Counting Bits", url: "https://leetcode.com/problems/counting-bits", difficulty: "EASY", points: 10 },
{ title: "Same Tree", url: "https://leetcode.com/problems/same-tree", difficulty: "EASY", points: 10 },
{ title: "Number of 1 Bits", url: "https://leetcode.com/problems/number-of-1-bits", difficulty: "EASY", points: 10 },
{ title: "Longest Common Prefix", url: "https://leetcode.com/problems/longest-common-prefix", difficulty: "EASY", points: 10 },
{ title: "Single Number", url: "https://leetcode.com/problems/single-number", difficulty: "EASY", points: 10 },
{ title: "Palindrome Linked List", url: "https://leetcode.com/problems/palindrome-linked-list", difficulty: "EASY", points: 10 },
{ title: "Move Zeroes", url: "https://leetcode.com/problems/move-zeroes", difficulty: "EASY", points: 10 },
{ title: "Symmetric Tree", url: "https://leetcode.com/problems/symmetric-tree", difficulty: "EASY", points: 10 },
{ title: "Missing Number", url: "https://leetcode.com/problems/missing-number", difficulty: "EASY", points: 10 },
{ title: "Palindrome Number", url: "https://leetcode.com/problems/palindrome-number", difficulty: "EASY", points: 10 },
{ title: "Convert Sorted Array to Binary Search Tree", url: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree", difficulty: "EASY", points: 10 },
{ title: "Reverse Bits", url: "https://leetcode.com/problems/reverse-bits", difficulty: "EASY", points: 10 },
{ title: "Subtree of Another Tree", url: "https://leetcode.com/problems/subtree-of-another-tree", difficulty: "EASY", points: 10 },
{ title: "Squares of a Sorted Array", url: "https://leetcode.com/problems/squares-of-a-sorted-array", difficulty: "EASY", points: 10 },

// Medium (102 × 20 points)
{ title: "Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray", difficulty: "MEDIUM", points: 20 },
{ title: "Insert Interval", url: "https://leetcode.com/problems/insert-interval", difficulty: "MEDIUM", points: 20 },
{ title: "01 Matrix", url: "https://leetcode.com/problems/01-matrix", difficulty: "MEDIUM", points: 20 },
{ title: "K Closest Points to Origin", url: "https://leetcode.com/problems/k-closest-points-to-origin", difficulty: "MEDIUM", points: 20 },
{ title: "Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters", difficulty: "MEDIUM", points: 20 },
{ title: "3Sum", url: "https://leetcode.com/problems/3sum", difficulty: "MEDIUM", points: 20 },
{ title: "Binary Tree Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal", difficulty: "MEDIUM", points: 20 },
{ title: "Clone Graph", url: "https://leetcode.com/problems/clone-graph", difficulty: "MEDIUM", points: 20 },
{ title: "Evaluate Reverse Polish Notation", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation", difficulty: "MEDIUM", points: 20 },
{ title: "Course Schedule", url: "https://leetcode.com/problems/course-schedule", difficulty: "MEDIUM", points: 20 },
{ title: "Implement Trie (Prefix Tree)", url: "https://leetcode.com/problems/implement-trie-prefix-tree", difficulty: "MEDIUM", points: 20 },
{ title: "Coin Change", url: "https://leetcode.com/problems/coin-change", difficulty: "MEDIUM", points: 20 },
{ title: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self", difficulty: "MEDIUM", points: 20 },
{ title: "Min Stack", url: "https://leetcode.com/problems/min-stack", difficulty: "MEDIUM", points: 20 },
{ title: "Validate Binary Search Tree", url: "https://leetcode.com/problems/validate-binary-search-tree", difficulty: "MEDIUM", points: 20 },
{ title: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands", difficulty: "MEDIUM", points: 20 },
{ title: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges", difficulty: "MEDIUM", points: 20 },
{ title: "Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array", difficulty: "MEDIUM", points: 20 },
{ title: "Combination Sum", url: "https://leetcode.com/problems/combination-sum", difficulty: "MEDIUM", points: 20 },
{ title: "Permutations", url: "https://leetcode.com/problems/permutations", difficulty: "MEDIUM", points: 20 },
{ title: "Merge Intervals", url: "https://leetcode.com/problems/merge-intervals", difficulty: "MEDIUM", points: 20 },
{ title: "Lowest Common Ancestor of a Binary Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree", difficulty: "MEDIUM", points: 20 },
{ title: "Time Based Key-Value Store", url: "https://leetcode.com/problems/time-based-key-value-store", difficulty: "MEDIUM", points: 20 },
{ title: "Accounts Merge", url: "https://leetcode.com/problems/accounts-merge", difficulty: "MEDIUM", points: 20 },
{ title: "Sort Colors", url: "https://leetcode.com/problems/sort-colors", difficulty: "MEDIUM", points: 20 },
{ title: "Word Break", url: "https://leetcode.com/problems/word-break", difficulty: "MEDIUM", points: 20 },
{ title: "Partition Equal Subset Sum", url: "https://leetcode.com/problems/partition-equal-subset-sum", difficulty: "MEDIUM", points: 20 },
{ title: "String to Integer (atoi)", url: "https://leetcode.com/problems/string-to-integer-atoi", difficulty: "MEDIUM", points: 20 },
{ title: "Spiral Matrix", url: "https://leetcode.com/problems/spiral-matrix", difficulty: "MEDIUM", points: 20 },
{ title: "Subsets", url: "https://leetcode.com/problems/subsets", difficulty: "MEDIUM", points: 20 },
{ title: "Binary Tree Right Side View", url: "https://leetcode.com/problems/binary-tree-right-side-view", difficulty: "MEDIUM", points: 20 },
{ title: "Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring", difficulty: "MEDIUM", points: 20 },
{ title: "Unique Paths", url: "https://leetcode.com/problems/unique-paths", difficulty: "MEDIUM", points: 20 },
{ title: "Construct Binary Tree from Preorder and Inorder Traversal", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal", difficulty: "MEDIUM", points: 20 },
{ title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water", difficulty: "MEDIUM", points: 20 },
{ title: "Letter Combinations of a Phone Number", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number", difficulty: "MEDIUM", points: 20 },
{ title: "Word Search", url: "https://leetcode.com/problems/word-search", difficulty: "MEDIUM", points: 20 },
{ title: "Find All Anagrams in a String", url: "https://leetcode.com/problems/find-all-anagrams-in-a-string", difficulty: "MEDIUM", points: 20 },
{ title: "Minimum Height Trees", url: "https://leetcode.com/problems/minimum-height-trees", difficulty: "MEDIUM", points: 20 },
{ title: "Task Scheduler", url: "https://leetcode.com/problems/task-scheduler", difficulty: "MEDIUM", points: 20 },
{ title: "LRU Cache", url: "https://leetcode.com/problems/lru-cache", difficulty: "MEDIUM", points: 20 },
{ title: "Kth Smallest Element in a BST", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst", difficulty: "MEDIUM", points: 20 },
{ title: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures", difficulty: "MEDIUM", points: 20 },
{ title: "House Robber", url: "https://leetcode.com/problems/house-robber", difficulty: "MEDIUM", points: 20 },
{ title: "Gas Station", url: "https://leetcode.com/problems/gas-station", difficulty: "MEDIUM", points: 20 },
{ title: "Next Permutation", url: "https://leetcode.com/problems/next-permutation", difficulty: "MEDIUM", points: 20 },
{ title: "Valid Sudoku", url: "https://leetcode.com/problems/valid-sudoku", difficulty: "MEDIUM", points: 20 },
{ title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams", difficulty: "MEDIUM", points: 20 },
{ title: "Maximum Product Subarray", url: "https://leetcode.com/problems/maximum-product-subarray", difficulty: "MEDIUM", points: 20 },
{ title: "Design Add and Search Words Data Structure", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure", difficulty: "MEDIUM", points: 20 },
{ title: "Pacific Atlantic Water Flow", url: "https://leetcode.com/problems/pacific-atlantic-water-flow", difficulty: "MEDIUM", points: 20 },
{ title: "Remove Nth Node From End of List", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list", difficulty: "MEDIUM", points: 20 },
{ title: "Shortest Path to Get Food", url: "https://leetcode.com/problems/shortest-path-to-get-food", difficulty: "MEDIUM", points: 20 },
{ title: "Find the Duplicate Number", url: "https://leetcode.com/problems/find-the-duplicate-number", difficulty: "MEDIUM", points: 20 },
{ title: "Top K Frequent Words", url: "https://leetcode.com/problems/top-k-frequent-words", difficulty: "MEDIUM", points: 20 },
{ title: "Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence", difficulty: "MEDIUM", points: 20 },
{ title: "Graph Valid Tree", url: "https://leetcode.com/problems/graph-valid-tree", difficulty: "MEDIUM", points: 20 },
{ title: "Course Schedule II", url: "https://leetcode.com/problems/course-schedule-ii", difficulty: "MEDIUM", points: 20 },
{ title: "Swap Nodes in Pairs", url: "https://leetcode.com/problems/swap-nodes-in-pairs", difficulty: "MEDIUM", points: 20 },
{ title: "Path Sum II", url: "https://leetcode.com/problems/path-sum-ii", difficulty: "MEDIUM", points: 20 },
{ title: "Longest Consecutive Sequence", url: "https://leetcode.com/problems/longest-consecutive-sequence", difficulty: "MEDIUM", points: 20 },
{ title: "Rotate Array", url: "https://leetcode.com/problems/rotate-array", difficulty: "MEDIUM", points: 20 },
{ title: "Odd Even Linked List", url: "https://leetcode.com/problems/odd-even-linked-list", difficulty: "MEDIUM", points: 20 },
{ title: "Decode String", url: "https://leetcode.com/problems/decode-string", difficulty: "MEDIUM", points: 20 },
{ title: "Contiguous Array", url: "https://leetcode.com/problems/contiguous-array", difficulty: "MEDIUM", points: 20 },
{ title: "Maximum Width of Binary Tree", url: "https://leetcode.com/problems/maximum-width-of-binary-tree", difficulty: "MEDIUM", points: 20 },
{ title: "Find K Closest Elements", url: "https://leetcode.com/problems/find-k-closest-elements", difficulty: "MEDIUM", points: 20 },
{ title: "Longest Repeating Character Replacement", url: "https://leetcode.com/problems/longest-repeating-character-replacement", difficulty: "MEDIUM", points: 20 },
{ title: "Inorder Successor in BST", url: "https://leetcode.com/problems/inorder-successor-in-bst", difficulty: "MEDIUM", points: 20 },
{ title: "Jump Game", url: "https://leetcode.com/problems/jump-game", difficulty: "MEDIUM", points: 20 },
{ title: "Add Two Numbers", url: "https://leetcode.com/problems/add-two-numbers", difficulty: "MEDIUM", points: 20 },
{ title: "Generate Parentheses", url: "https://leetcode.com/problems/generate-parentheses", difficulty: "MEDIUM", points: 20 },
{ title: "Sort List", url: "https://leetcode.com/problems/sort-list", difficulty: "MEDIUM", points: 20 },
{ title: "Number of Connected Components in an Undirected Graph", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph", difficulty: "MEDIUM", points: 20 },
{ title: "Minimum Knight Moves", url: "https://leetcode.com/problems/minimum-knight-moves", difficulty: "MEDIUM", points: 20 },
{ title: "Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k", difficulty: "MEDIUM", points: 20 },
{ title: "Asteroid Collision", url: "https://leetcode.com/problems/asteroid-collision", difficulty: "MEDIUM", points: 20 },
{ title: "Random Pick with Weight", url: "https://leetcode.com/problems/random-pick-with-weight", difficulty: "MEDIUM", points: 20 },
 { title: "Kth Largest Element in an Array", url: "https://leetcode.com/problems/kth-largest-element-in-an-array", difficulty: "MEDIUM", points: 20 },
{ title: "Maximal Square", url: "https://leetcode.com/problems/maximal-square", difficulty: "MEDIUM", points: 20 },
{ title: "Rotate Image", url: "https://leetcode.com/problems/rotate-image", difficulty: "MEDIUM", points: 20 },
{ title: "Binary Tree Zigzag Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal", difficulty: "MEDIUM", points: 20 },
{ title: "Design Hit Counter", url: "https://leetcode.com/problems/design-hit-counter", difficulty: "MEDIUM", points: 20 },
{ title: "Path Sum III", url: "https://leetcode.com/problems/path-sum-iii", difficulty: "MEDIUM", points: 20 },
{ title: "Pow(x, n)", url: "https://leetcode.com/problems/powx-n", difficulty: "MEDIUM", points: 20 },
{ title: "Search a 2D Matrix", url: "https://leetcode.com/problems/search-a-2d-matrix", difficulty: "MEDIUM", points: 20 },
{ title: "Largest Number", url: "https://leetcode.com/problems/largest-number", difficulty: "MEDIUM", points: 20 },
{ title: "Decode Ways", url: "https://leetcode.com/problems/decode-ways", difficulty: "MEDIUM", points: 20 },
{ title: "Meeting Rooms II", url: "https://leetcode.com/problems/meeting-rooms-ii", difficulty: "MEDIUM", points: 20 },
{ title: "Reverse Integer", url: "https://leetcode.com/problems/reverse-integer", difficulty: "MEDIUM", points: 20 },
{ title: "Set Matrix Zeroes", url: "https://leetcode.com/problems/set-matrix-zeroes", difficulty: "MEDIUM", points: 20 },
{ title: "Reorder List", url: "https://leetcode.com/problems/reorder-list", difficulty: "MEDIUM", points: 20 },
{ title: "Encode and Decode Strings", url: "https://leetcode.com/problems/encode-and-decode-strings", difficulty: "MEDIUM", points: 20 },
{ title: "Cheapest Flights Within K Stops", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops", difficulty: "MEDIUM", points: 20 },
{ title: "All Nodes Distance K in Binary Tree", url: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree", difficulty: "MEDIUM", points: 20 },
{ title: "3Sum Closest", url: "https://leetcode.com/problems/3sum-closest", difficulty: "MEDIUM", points: 20 },
{ title: "Rotate List", url: "https://leetcode.com/problems/rotate-list", difficulty: "MEDIUM", points: 20 },
{ title: "Find Minimum in Rotated Sorted Array", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array", difficulty: "MEDIUM", points: 20 },
{ title: "Basic Calculator II", url: "https://leetcode.com/problems/basic-calculator-ii", difficulty: "MEDIUM", points: 20 },
{ title: "Combination Sum IV", url: "https://leetcode.com/problems/combination-sum-iv", difficulty: "MEDIUM", points: 20 },
{ title: "Insert Delete GetRandom O(1)", url: "https://leetcode.com/problems/insert-delete-getrandom-o1", difficulty: "MEDIUM", points: 20 },
{ title: "Non-overlapping Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals", difficulty: "MEDIUM", points: 20 },

// Hard (26 × 30 points)
{ title: "Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring", difficulty: "HARD", points: 30 },
{ title: "Serialize and Deserialize Binary Tree", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree", difficulty: "HARD", points: 30 },
{ title: "Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water", difficulty: "HARD", points: 30 },
{ title: "Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream", difficulty: "HARD", points: 30 },
{ title: "Word Ladder", url: "https://leetcode.com/problems/word-ladder", difficulty: "HARD", points: 30 },
{ title: "Basic Calculator", url: "https://leetcode.com/problems/basic-calculator", difficulty: "HARD", points: 30 },
{ title: "Maximum Profit in Job Scheduling", url: "https://leetcode.com/problems/maximum-profit-in-job-scheduling", difficulty: "HARD", points: 30 },
{ title: "Merge k Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists", difficulty: "HARD", points: 30 },
{ title: "Largest Rectangle in Histogram", url: "https://leetcode.com/problems/largest-rectangle-in-histogram", difficulty: "HARD", points: 30 },
{ title: "Binary Tree Maximum Path Sum", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum", difficulty: "HARD", points: 30 },
{ title: "Maximum Frequency Stack", url: "https://leetcode.com/problems/maximum-frequency-stack", difficulty: "HARD", points: 30 },
{ title: "Median of Two Sorted Arrays", url: "https://leetcode.com/problems/median-of-two-sorted-arrays", difficulty: "HARD", points: 30 },
{ title: "Longest Increasing Path in a Matrix", url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix", difficulty: "HARD", points: 30 },
{ title: "Longest Valid Parentheses", url: "https://leetcode.com/problems/longest-valid-parentheses", difficulty: "HARD", points: 30 },
{ title: "Design In-Memory File System", url: "https://leetcode.com/problems/design-in-memory-file-system", difficulty: "HARD", points: 30 },
{ title: "Employee Free Time", url: "https://leetcode.com/problems/employee-free-time", difficulty: "HARD", points: 30 },
{ title: "Word Search II", url: "https://leetcode.com/problems/word-search-ii", difficulty: "HARD", points: 30 },
{ title: "Alien Dictionary", url: "https://leetcode.com/problems/alien-dictionary", difficulty: "HARD", points: 30 },
{ title: "Bus Routes", url: "https://leetcode.com/problems/bus-routes", difficulty: "HARD", points: 30 },
{ title: "Sliding Window Maximum", url: "https://leetcode.com/problems/sliding-window-maximum", difficulty: "HARD", points: 30 },
{ title: "Palindrome Pairs", url: "https://leetcode.com/problems/palindrome-pairs", difficulty: "HARD", points: 30 },
{ title: "Reverse Nodes in k-Group", url: "https://leetcode.com/problems/reverse-nodes-in-k-group", difficulty: "HARD", points: 30 },
{ title: "Sudoku Solver", url: "https://leetcode.com/problems/sudoku-solver", difficulty: "HARD", points: 30 },
{ title: "First Missing Positive", url: "https://leetcode.com/problems/first-missing-positive", difficulty: "HARD", points: 30 },
{ title: "N-Queens", url: "https://leetcode.com/problems/n-queens", difficulty: "HARD", points: 30 },
{ title: "Smallest Range Covering Elements from K Lists", url: "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists", difficulty: "HARD", points: 30 },




  ];

  async function main(){
  //   console.log("seeding questions...started");
  //   await prisma.question.deleteMany({});

  //   for (const q of QUESTIONS){
  //      const question = await prisma.question.create({
  //       data:q,
  //      });
  //      console.log(`Created question: ${question.title} (${question.difficulty})`);

  // }
  console.log("Seeding finished successfully!");

}

main().catch((e)=>{
    console.error("Error seeding data:", e);
    process.exit(1);
}).finally(async()=>{
    await prisma.$disconnect();
    await pool.end();
})