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
    { title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", difficulty: "EASY", points: 10 },
    { title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", difficulty: "EASY", points: 10 },
    { title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", difficulty: "EASY", points: 10 },
    { title: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", difficulty: "EASY", points: 10 },
    { title: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/", difficulty: "EASY", points: 10 },
    { title: "Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/", difficulty: "EASY", points: 10 },
    { title: "Binary Search", url: "https://leetcode.com/problems/binary-search/", difficulty: "EASY", points: 10 },
  
    // Medium Questions (20 Points)
    { title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/", difficulty: "MEDIUM", points: 20 },
    { title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", difficulty: "MEDIUM", points: 20 },
    { title: "3Sum", url: "https://leetcode.com/problems/3sum/", difficulty: "MEDIUM", points: 20 },
    { title: "Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", difficulty: "MEDIUM", points: 20 },
    { title: "Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring/", difficulty: "MEDIUM", points: 20 },
    { title: "Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", difficulty: "MEDIUM", points: 20 },
    { title: "Kth Largest Element in an Array", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", difficulty: "MEDIUM", points: 20 },
  
    // Hard Questions (30 Points)
    { title: "Median of Two Sorted Arrays", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", difficulty: "HARD", points: 30 },
    { title: "Merge k Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", difficulty: "HARD", points: 30 },
    { title: "Longest Valid Parentheses", url: "https://leetcode.com/problems/longest-valid-parentheses/", difficulty: "HARD", points: 30 },
    { title: "Edit Distance", url: "https://leetcode.com/problems/edit-distance/", difficulty: "HARD", points: 30 },
    { title: "Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/", difficulty: "HARD", points: 30 },
    { title: "N-Queens", url: "https://leetcode.com/problems/n-queens/", difficulty: "HARD", points: 30 },
  ];

  async function main(){
    console.log("seeding questions...started");
    await prisma.question.deleteMany({});

    for (const q of QUESTIONS){
       const question = await prisma.question.create({
        data:q,
       });
       console.log(`Created question: ${question.title} (${question.difficulty})`);

  }
  console.log("Seeding finished successfully!");

}

main().catch((e)=>{
    console.error("Error seeding data:", e);
    process.exit(1);
}).finally(async()=>{
    await prisma.$disconnect();
    await pool.end();
})