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
            Long taskId = Long.valueOf(payload.get("taskId")); // this id comes from the TaskRepository
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
            exercise.setCompletionTime(0);
            exercise.setSuccess(false);

            exercise = exerciseRepository.save(exercise);
            return ResponseEntity.ok(Map.of("exerciseId", exercise.getExerciseId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error starting exercise");
        }
    }
}
