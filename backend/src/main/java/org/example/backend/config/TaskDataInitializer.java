package org.example.backend.config;

import org.example.backend.entity.Task;
import org.example.backend.persistence.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TaskDataInitializer implements CommandLineRunner {

    private final TaskRepository taskRepository;

    public TaskDataInitializer(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (taskRepository.count() > 0) {
            return;
        }

        List<Task> tasksWithAI = List.of(
                new Task(
                        "Task #1 (With AI) - Check Even/Odd",
                        "Implement a function isEven(n) that returns true if n is even, or false if n is odd.",
                        "Input: 4 → true|Input: 7 → false|Input: 0 → true|Input: -2 → true",
                        "easy",
                        true
                ),
                new Task(
                        "Task #2 (With AI) - Count Vowels in a String",
                        "Implement a function countVowels(str) that returns the number of vowels (a, e, i, o, u). Decide if uppercase letters also count as vowels.",
                        "Input: 'Hello' → 2 (e, o)|Input: 'xyz' → 0|Input: 'AEIOU' → 5|Input: 'Green' → 2",
                        "easy",
                        true
                ),
                new Task(
                        "Task #3 (With AI) - Check Palindrome",
                        "Implement a function isPalindrome(str) that returns true if str reads the same forwards and backwards, otherwise false.",
                        "Input: 'racecar' → true|Input: 'hello' → false|Input: 'a' → true|Input: '' → true",
                        "easy",
                        true
                ),
                new Task(
                        "Task #4 (With AI) - Remove Duplicates from Sorted Array",
                        "Implement a function removeDuplicates(nums) that removes duplicates in place from a sorted array, returning the new length or the array of distinct elements.",
                        "Input: [1, 1, 2, 2, 3] → [1, 2, 3], length=3|Input: [2, 2, 2] → [2], length=1|Input: [] → [], length=0",
                        "medium",
                        true
                ),
                new Task(
                        "Task #5 (With AI) - Two Sum",
                        "Implement a function twoSum(nums, target) that returns the indices of two numbers in nums that add up to target. Assume exactly one solution exists.",
                        "nums=[2,7,11,15], target=9 → [0,1]|nums=[3,2,4], target=6 → [1,2]|nums=[3,3], target=6 → [0,1]",
                        "medium",
                        true
                )
        );

        // Data for tasks without AI
        List<Task> tasksWithoutAI = List.of(
                new Task(
                        "Task #1 (No AI) - Add Two Numbers",
                        "Implement a function addTwoNumbers(a, b) that returns the sum of a and b.",
                        "Input: 2, 3 → Output: 5|Input: 0, 0 → Output: 0|Input: -1, 5 → Output: 4",
                        "easy",
                        false
                ),
                new Task(
                        "Task #2 (No AI) - Repeat a String N Times",
                        "Implement a function repeatString(str, n) that returns str repeated n times. If n <= 0, return an empty string.",
                        "Input: ('Hi', 2) → Output: 'HiHi'|Input: ('Hello', 3) → Output: 'HelloHelloHello'|Input: ('test', 0) → Output: ''",
                        "easy",
                        false
                ),
                new Task(
                        "Task #3 (No AI) - Reverse a String",
                        "Implement a function reverseString(str) that returns the reversed version of str.",
                        "Input: 'Hello' → Output: 'olleH'|Input: '' → Output: ''|Input: 'abc' → Output: 'cba'",
                        "easy",
                        false
                ),
                new Task(
                        "Task #4 (No AI) - Find Minimum in an Array",
                        "Implement a function findMin(nums) that returns the smallest integer in the array nums. Decide how to handle an empty array.",
                        "Input: [3, 1, 5, 2] → Output: 1|Input: [10, 10, 10] → Output: 10|Input: [] → handle (e.g., return null or Infinity)",
                        "medium",
                        false
                ),
                new Task(
                        "Task #5 (No AI) - FizzBuzz",
                        "Implement a function fizzBuzz(n) that prints or returns the numbers 1..n, but for multiples of 3 output 'Fizz', for multiples of 5 output 'Buzz', and for multiples of both 3 and 5 output 'FizzBuzz'.",
                        "Input: 15 → Output sequence: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz",
                        "medium",
                        false
                )
        );

        taskRepository.saveAll(tasksWithAI);
        taskRepository.saveAll(tasksWithoutAI);
    }
}
