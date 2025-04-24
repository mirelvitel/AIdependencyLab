package org.example.backend.controller;

import org.example.backend.entity.Exercise;
import org.example.backend.entity.Interaction;
import org.example.backend.entity.InteractionType;
import org.example.backend.entity.Session;
import org.example.backend.persistence.ExerciseRepository;
import org.example.backend.persistence.InteractionRepository;
import org.example.backend.persistence.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class InteractionController {

    private static final Logger logger = LoggerFactory.getLogger(InteractionController.class);

    private final InteractionRepository interactionRepository;
    private final SessionRepository sessionRepository;
    private final ExerciseRepository exerciseRepository;

    @Autowired
    public InteractionController(InteractionRepository interactionRepository,
                                 SessionRepository sessionRepository,
                                 ExerciseRepository exerciseRepository) {
        this.interactionRepository = interactionRepository;
        this.sessionRepository = sessionRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @PostMapping("/log-interaction")
    public ResponseEntity<?> logInteraction(@RequestBody Map<String, String> payload) {
        try {
            Long sessionId = Long.valueOf(payload.get("sessionId"));
            Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
            if (sessionOpt.isEmpty()) {
                logger.error("Session with id {} not found", sessionId);
                return ResponseEntity.badRequest().body("Invalid session");
            }
            String exerciseIdStr = payload.get("exerciseId");
            if (exerciseIdStr == null || exerciseIdStr.isBlank()) {
                logger.error("exerciseId is required but was not provided");
                return ResponseEntity.badRequest().body("exerciseId is required");
            }
            Long exerciseId = Long.valueOf(exerciseIdStr);
            Optional<Exercise> exerciseOpt = exerciseRepository.findById(exerciseId);
            if (exerciseOpt.isEmpty()) {
                logger.error("Exercise with id {} not found", exerciseId);
                return ResponseEntity.badRequest().body("Invalid exercise");
            }
            Exercise exercise = exerciseOpt.get();

            String actionTypeString = payload.get("actionType").trim();
            String details = payload.get("details");

            Interaction interaction = new Interaction();
            interaction.setExercise(exercise);
            interaction.setActionType(InteractionType.valueOf(actionTypeString));
            interaction.setDetails(details);

            interactionRepository.save(interaction);
            return ResponseEntity.ok(interaction);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid actionType provided: {}", payload.get("actionType"), e);
            return ResponseEntity.badRequest().body("Invalid actionType provided");
        } catch (Exception e) {
            logger.error("Unexpected error while logging interaction", e);
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }
}
