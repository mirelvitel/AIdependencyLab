// src/tasksWithAI.js
const tasksWithAI = [
    {
        id: 1,
        title: "Task #1 (With AI) - Check Even/Odd",
        description: `Implement a function isEven(n) that returns true if n is even, or false if n is odd.`,
        testCases: [
            "Input: 4 → true",
            "Input: 7 → false",
            "Input: 0 → true",
            "Input: -2 → true",
        ],
    },
    {
        id: 2,
        title: "Task #2 (With AI) - Count Vowels in a String",
        description: `Implement a function countVowels(str) that returns the number of vowels (a, e, i, o, u). Decide if uppercase letters also count as vowels.`,
        testCases: [
            "Input: 'Hello' → 2 (e, o)",
            "Input: 'xyz' → 0",
            "Input: 'AEIOU' → 5",
            "Input: 'Green' → 2",
        ],
    },
    {
        id: 3,
        title: "Task #3 (With AI) - Check Palindrome",
        description: `Implement a function isPalindrome(str) that returns true if str reads the same forwards and backwards, otherwise false.`,
        testCases: [
            "Input: 'racecar' → true",
            "Input: 'hello' → false",
            "Input: 'a' → true",
            "Input: '' → true",
        ],
    },
    {
        id: 4,
        title: "Task #4 (With AI) - Remove Duplicates from Sorted Array",
        description: `Implement a function removeDuplicates(nums) that removes duplicates in place from a sorted array, returning the new length or the array of distinct elements.`,
        testCases: [
            "Input: [1, 1, 2, 2, 3] → [1, 2, 3], length=3",
            "Input: [2, 2, 2] → [2], length=1",
            "Input: [] → [], length=0",
        ],
    },
    {
        id: 5,
        title: "Task #5 (With AI) - Two Sum",
        description: `Implement a function twoSum(nums, target) that returns the indices of two numbers in nums that add up to target. Assume exactly one solution exists.`,
        testCases: [
            "nums=[2,7,11,15], target=9 → [0,1]",
            "nums=[3,2,4], target=6 → [1,2]",
            "nums=[3,3], target=6 → [0,1]",
        ],
    },
];

export default tasksWithAI;