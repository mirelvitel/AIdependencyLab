export const TASK_FN_MAP = {
    "Task #1 (With AI) - Check Even/Odd":           "isEven",
    "Task #2 (With AI) - Count Vowels in a String": "countVowels",
    "Task #3 (With AI) - Check Palindrome":       "isPalindrome",
    "Task #4 (With AI) - Remove Duplicates from Sorted Array": "removeDuplicates",

    "Task #1 (No AI) - Add Two Numbers":            "addTwoNumbers",
    "Task #2 (No AI) - Check Prime":               "isPrime",
    "Task #3 (No AI) - Reverse a String":           "reverseString",
    "Task #4 (No AI) - Find Minimum in an Array":   "findMin"
};

const SKELETONS = {
    java: {
        isEven: `// DO NOT MODIFY anything outside the method below.
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) { sc.close(); return; }
        int n = sc.nextInt();
        System.out.println(isEven(n));
        sc.close();
    }

    static boolean isEven(int n) {
        // TODO: implement this method only
        return false;
    }
}`,

        countVowels: `// DO NOT MODIFY anything outside the method below.
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) { sc.close(); return; }
        String str = sc.nextLine();
        System.out.println(countVowels(str));
        sc.close();
    }

    static int countVowels(String str) {
        // TODO: implement this method only
        return 0;
    }
}`,

        isPalindrome: `// DO NOT MODIFY anything outside the method below.
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) { sc.close(); return; }
        String str = sc.nextLine();
        System.out.println(isPalindrome(str));
        sc.close();
    }

    static boolean isPalindrome(String str) {
        // TODO: implement this method only
        return false;
    }
}`,

        removeDuplicates: `// DO NOT MODIFY anything outside the method below.
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) { sc.close(); return; }
        String line = sc.nextLine().trim();
        line = line.substring(1, line.length() - 1);
        int[] nums = line.isEmpty()
            ? new int[0]
            : Arrays.stream(line.split(","))
                    .map(String::trim)
                    .mapToInt(Integer::parseInt)
                    .toArray();

        int[] distinct = removeDuplicates(nums);
        // remove spaces from array string
        System.out.println(Arrays.toString(distinct).replace(" ", ""));
        sc.close();
    }

    static int[] removeDuplicates(int[] nums) {
        // TODO: implement this method only
        return new int[0];
    }
}`,

        addTwoNumbers: `// DO NOT MODIFY anything outside the method below.
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) { sc.close(); return; }
        String line = sc.nextLine().trim(); // e.g. "2,3"
        sc.close();

        String[] parts = line.split(",");
        if (parts.length < 2) return;
        int a = Integer.parseInt(parts[0].trim());
        int b = Integer.parseInt(parts[1].trim());
        System.out.println("Output: " + addTwoNumbers(a, b));
    }

    static int addTwoNumbers(int a, int b) {
        // TODO: implement this method only
        return 0;
    }
}`,

        isPrime: `// DO NOT MODIFY anything outside the method below.
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) { sc.close(); return; }
        int n = sc.nextInt();
        System.out.println(isPrime(n));
        sc.close();
    }

    static boolean isPrime(int n) {
        // TODO: implement this method only
        return false;
    }
}`,

        reverseString: `// DO NOT MODIFY anything outside the method below.
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) { sc.close(); return; }
        String str = sc.nextLine();
        System.out.println(reverseString(str));
        sc.close();
    }

    static String reverseString(String str) {
        // TODO: implement this method only
        return "";
    }
}`,

        findMin: `// DO NOT MODIFY anything outside the method below.
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) { sc.close(); return; }
        String line = sc.nextLine().trim(); // e.g. "[3,1,5,2]"
        sc.close();
        line = line.substring(1, line.length() - 1);
        int[] nums = line.isEmpty()
            ? new int[0]
            : Arrays.stream(line.split(","))
                    .map(String::trim)
                    .mapToInt(Integer::parseInt)
                    .toArray();

        Integer m = findMin(nums);
        System.out.println(m == null ? "null" : m);
    }

    static Integer findMin(int[] nums) {
        // TODO: implement this method only
        return null;
    }
}`
    }
};

export default SKELETONS;
