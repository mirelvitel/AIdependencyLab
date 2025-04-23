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
                        "very_easy",
                        true
                ),
                new Task(
                        "Task #2 (With AI) - Count Vowels in a String",
                        "Implement a function countVowels(str) that returns the number of vowels (a, e, i, o, u).",
                        "Input: Hello → 2|Input: xyz → 0|Input: AEIOU → 5|Input: Green → 2",
                        "easy",
                        true
                ),
                new Task(
                        "Task #3 (With AI) - Check Palindrome",
                        "Implement a function isPalindrome(str) that returns true if str reads the same forwards and backwards, otherwise false.",
                        "Input: racecar → true|Input: hello → false|Input: a → true|Input:  → true",
                        "easy",
                        true
                ),
                new Task(
                        "Task #4 (With AI) - Remove Duplicates from Sorted Array",
                        "Implement a function removeDuplicates(nums) that removes duplicates from a sorted array, returning a new array of distinct elements.",
                        "Input: [1,1,2,2,3] → [1,2,3]|Input: [2,2,2] → [2]|Input: [] → []",
                        "medium",
                        true
                )
        );

        List<Task> tasksWithoutAI = List.of(
                new Task(
                        "Task #1 (No AI) - Add Two Numbers",
                        "Implement a function addTwoNumbers(a, b) that returns the sum of a and b.",
                        "Input: 2,3 → Output: 5|Input: 0,0 → Output: 0|Input: -1,5 → Output: 4",
                        "very_easy",
                        false
                ),
                new Task(
                        "Task #2 (No AI) - Check Prime",
                        "Implement a function isPrime(n) that returns true if n is a prime number (n ≥ 2), otherwise false.",
                        "Input: 2 → true|Input: 4 → false|Input: 1 → false|Input: 17 → true",
                        "easy",
                        false
                ),
                new Task(
                        "Task #3 (No AI) - Reverse a String",
                        "Implement a function reverseString(str) that returns the reversed version of str.",
                        "Input: Hello → olleH|Input:  → |Input: abc → cba",
                        "easy",
                        false
                ),
                new Task(
                        "Task #4 (No AI) - Find Minimum in an Array",
                        "Implement a function findMin(nums) that returns the smallest integer in the array nums, or null if the array is empty.",
                        "Input: [3,1,5,2] → 1|Input: [10,10,10] → 10|Input: [] → null",
                        "medium",
                        false
                )
        );

        taskRepository.saveAll(tasksWithAI);
        taskRepository.saveAll(tasksWithoutAI);
    }
}
