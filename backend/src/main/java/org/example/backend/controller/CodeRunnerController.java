package org.example.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.backend.entity.*;
import org.example.backend.persistence.ExerciseRepository;
import org.example.backend.persistence.InteractionRepository;
import org.example.backend.persistence.SessionRepository;
import org.example.backend.persistence.TaskRepository;
import org.example.backend.service.CodeRunnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
public class CodeRunnerController {

    private final CodeRunnerService codeRunnerService;
    private final ExerciseRepository exerciseRepository;
    private final SessionRepository sessionRepository;
    private final TaskRepository taskRepository;
    private final InteractionRepository interactionRepository;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm:ss");

    @Autowired
    public CodeRunnerController(CodeRunnerService codeRunnerService,
                                ExerciseRepository exerciseRepository,
                                SessionRepository sessionRepository,
                                TaskRepository taskRepository,
                                InteractionRepository interactionrepository) {
        this.codeRunnerService = codeRunnerService;
        this.exerciseRepository = exerciseRepository;
        this.sessionRepository = sessionRepository;
        this.taskRepository = taskRepository;
        this.interactionRepository = interactionrepository;
    }

    @PostMapping("/run")
    public ResponseEntity<Map<String, Object>> runCode(@RequestBody Map<String, String> payload) {
        String language = payload.get("language");
        String code     = payload.get("code");
        Long   taskId   = Long.valueOf(payload.get("taskId"));
        Long   exerciseId = Long.valueOf(payload.get("exerciseId"));

        Map<String, Object> resp = codeRunnerService.runCode(language, code, taskId);

        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid exercise"));
        Interaction interaction = new Interaction();
        interaction.setExercise(exercise);
        interaction.setActionType(InteractionType.CODE_RUN);

        @SuppressWarnings("unchecked")
        List<Map<String, ?>> results = (List<Map<String, ?>>) resp.get("testResults");
        int total = results.size();
        int passed = (int) results.stream()
                .filter(r -> "passed".equals(r.get("status")))
                .count();
        interaction.setPassedCount(passed);
        interaction.setTotalCount(total);
        interaction.setDetails(code);

        interactionRepository.save(interaction);

        Boolean allPassed = (Boolean) resp.get("allPassed");
        exercise.setSuccess(allPassed);
        exerciseRepository.save(exercise);

        return ResponseEntity.ok(resp);
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
            exercise.setSuccess(false);
            exercise.setStartedAt(LocalDateTime.now());

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

            long secs = Duration.between(exercise.getStartedAt(), LocalDateTime.now()).getSeconds();
            long safeSecs = secs % 86400;
            String formatted = LocalTime.ofSecondOfDay(safeSecs).format(TIME_FMT);
            exercise.setCompletionTime(formatted);
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
