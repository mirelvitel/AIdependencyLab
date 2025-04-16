package org.example.backend.controller;

import org.example.backend.entity.Exercise;
import org.example.backend.entity.ExerciseComplexity;
import org.example.backend.entity.Session;
import org.example.backend.entity.Task;
import org.example.backend.persistence.ExerciseRepository;
import org.example.backend.persistence.SessionRepository;
import org.example.backend.persistence.TaskRepository;
import org.example.backend.service.CodeRunnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class CodeRunnerController {

    private final CodeRunnerService codeRunnerService;
    private final ExerciseRepository exerciseRepository;
    private final SessionRepository sessionRepository;
    private final TaskRepository taskRepository;

    @Autowired
    public CodeRunnerController(CodeRunnerService codeRunnerService,
                                ExerciseRepository exerciseRepository,
                                SessionRepository sessionRepository,
                                TaskRepository taskRepository) {
        this.codeRunnerService = codeRunnerService;
        this.exerciseRepository = exerciseRepository;
        this.sessionRepository = sessionRepository;
        this.taskRepository = taskRepository;
    }

    @PostMapping("/run")
    public ResponseEntity<Map<String, Object>> runCode(@RequestBody Map<String, String> payload) {
        String language = payload.get("language");
        String code = payload.get("code");

        Map<String, Object> jdoodleResponse = codeRunnerService.runCode(language, code);
        return ResponseEntity.ok(jdoodleResponse);
    }

    @PostMapping("/exercise/start")
    public ResponseEntity<?> startExercise(@RequestBody Map<String, String> payload) {
        try {
            Long sessionId = Long.valueOf(payload.get("sessionId"));
            Long taskId    = Long.valueOf(payload.get("taskId"));

            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid session"));

            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid task"));

            Exercise exercise = new Exercise();
            exercise.setSession(session);
            exercise.setTask(task);
            exercise.setIsAiEnabled(task.getIsAIEnabled());
            try {
                exercise.setComplexity(
                        ExerciseComplexity.valueOf(task.getComplexity().toUpperCase())
                );
            } catch (IllegalArgumentException ex) {
                exercise.setComplexity(ExerciseComplexity.EASY);
            }
            exercise.setCompleted(false);

            exercise = exerciseRepository.save(exercise);
            return ResponseEntity.ok(Map.of("exerciseId", exercise.getExerciseId()));
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(iae.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error starting exercise");
        }
    }

    @PostMapping("/exercise/complete")
    public ResponseEntity<?> completeExercise(@RequestBody Map<String, String> payload) {
        try {
            Long exerciseId = Long.valueOf(payload.get("exerciseId"));
            Exercise exercise = exerciseRepository.findById(exerciseId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid exercise"));

            if (payload.containsKey("completionTime")) {
                int seconds = Integer.parseInt(payload.get("completionTime"));
                String formatted = String.format("%02d:%02d:%02d",
                        seconds / 3600,
                        (seconds % 3600) / 60,
                        seconds % 60
                );
                exercise.setCompletionTime(formatted);
            }

            exercise.setCompleted(true);

            exerciseRepository.save(exercise);
            return ResponseEntity.ok(exercise);
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(iae.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error completing exercise");
        }
    }
}
