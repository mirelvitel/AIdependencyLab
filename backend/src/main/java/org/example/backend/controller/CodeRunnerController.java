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
import java.util.Optional;

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
            Long taskId = Long.valueOf(payload.get("taskId"));
            Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
            if (sessionOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid session");
            }
            Optional<Task> taskOpt = taskRepository.findById(taskId);
            if (taskOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid task");
            }
            Task task = taskOpt.get();

            Exercise exercise = new Exercise();
            exercise.setSession(sessionOpt.get());
            exercise.setTaskNumber(task.getTaskId().intValue());
            try {
                exercise.setComplexity(ExerciseComplexity.valueOf(task.getComplexity().toUpperCase()));
            } catch (IllegalArgumentException e) {
                exercise.setComplexity(ExerciseComplexity.EASY);
            }
            exercise.setCompleted(false);
            exercise.setCompletionTime(null);
            exercise.setSuccess(false);

            exercise = exerciseRepository.save(exercise);
            return ResponseEntity.ok(Map.of("exerciseId", exercise.getExerciseId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error starting exercise");
        }
    }

    @PostMapping("/exercise/complete")
    public ResponseEntity<?> completeExercise(@RequestBody Map<String, String> payload) {
        try {
            Long exerciseId = Long.valueOf(payload.get("exerciseId"));
            Optional<Exercise> exerciseOpt = exerciseRepository.findById(exerciseId);
            if (exerciseOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid exercise");
            }
            Exercise exercise = exerciseOpt.get();

            if (payload.containsKey("completionTime")) {
                int seconds = Integer.parseInt(payload.get("completionTime"));
                String timeFormatted = String.format("%02d:%02d:%02d",
                        seconds / 3600,
                        (seconds % 3600) / 60,
                        seconds % 60
                );
                exercise.setCompletionTime(timeFormatted);
            }

            exercise.setCompleted(true);
            exerciseRepository.save(exercise);
            return ResponseEntity.ok(exercise);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error completing exercise");
        }
    }
}
