package org.example.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.entity.Task;
import org.example.backend.persistence.TaskRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;

@Service
public class CodeRunnerService {
    private final TaskRepository taskRepository;
    private final RestTemplate   rest   = new RestTemplate();
    private final ObjectMapper   mapper = new ObjectMapper();

    @Value("${JUDGE0_API_URL}")
    private String judge0Url;
    @Value("${JUDGE0_API_KEY}")
    private String judge0Key;

    private static final Map<String,Integer> LANG_ID = Map.of(
            "java",   62,
            "python", 71,
            "csharp", 51,
            "cpp",    54
    );

    public CodeRunnerService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Map<String,Object> runCode(String language, String code, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid taskId"));
        String[] parts = task.getTestCases().split("\\|");
        List<Map<String,String>> cases = new ArrayList<>();
        for (String p : parts) {
            String[] kv = p.split("→");
            if (kv.length < 2) continue;
            cases.add(Map.of(
                    "stdin",    kv[0].replaceFirst(".*?:", "").trim(),
                    "expected", kv[1].trim()
            ));
        }

        String submissionsUrl = UriComponentsBuilder
                .fromHttpUrl(judge0Url)
                .path("/submissions")
                .queryParam("base64_encoded", false)
                .queryParam("wait", true)
                .toUriString();
        URI base = URI.create(judge0Url);

        HttpHeaders hdr = new HttpHeaders();
        hdr.setContentType(MediaType.APPLICATION_JSON);
        hdr.setAccept(List.of(MediaType.APPLICATION_JSON));
        hdr.set("X-RapidAPI-Key",  judge0Key);
        hdr.set("X-RapidAPI-Host", base.getHost());

        int langId = LANG_ID.getOrDefault(language, 62);
        List<Map<String,Object>> results = new ArrayList<>();

        for (var tc : cases) {
            Map<String,Object> bodyMap = Map.of(
                    "source_code", code,
                    "language_id", langId,
                    "stdin",       tc.get("stdin")
            );

            String jsonBody;
            try {
                jsonBody = mapper.writeValueAsString(bodyMap);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize Judge0 request body", e);
            }

            HttpEntity<String> req = new HttpEntity<>(jsonBody, hdr);
            ResponseEntity<String> rawResp = rest.postForEntity(submissionsUrl, req, String.class);

            Map<String,Object> jr;
            try {
                jr = mapper.readValue(rawResp.getBody(), new TypeReference<Map<String,Object>>() {});
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to parse Judge0 response", e);
            }

            // Check for compilation error on the first submission — all cases will fail the same way
            String compileOutput = Objects.toString(jr.get("compile_output"), "").strip();
            if (!compileOutput.isEmpty()) {
                Map<String,Object> errorMap = new HashMap<>();
                errorMap.put("syntaxError", compileOutput);
                errorMap.put("testResults", List.of());
                errorMap.put("allPassed",   false);
                return errorMap;
            }

            String out   = Objects.toString(jr.get("stdout"), "").strip();
            String err   = Objects.toString(jr.get("stderr"), "").strip();
            boolean pass = out.equals(tc.get("expected"));
            String actual = pass ? out : (err.isEmpty() ? out : err);

            results.add(Map.of(
                    "stdin",    tc.get("stdin"),
                    "expected", tc.get("expected"),
                    "stdout",   actual,
                    "status",   pass ? "passed" : "failed"
            ));
        }

        boolean allPassed = results.stream()
                .allMatch(r -> "passed".equals(r.get("status")));

        Map<String,Object> finalMap = new HashMap<>();
        finalMap.put("syntaxError", null);
        finalMap.put("testResults", results);
        finalMap.put("allPassed",   allPassed);
        return finalMap;
    }
}
