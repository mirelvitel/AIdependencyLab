package org.example.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.backend.entity.Session;
import org.example.backend.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class SessionController {

    private final SessionService sessionService;

    @Autowired
    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/start-session")
    public ResponseEntity<Session> startSession(@RequestBody Map<String, String> payload) {
        String yearOfStudy = payload.get("yearOfStudy");
        String codingExperience = payload.get("codingExperience");

        Session session = sessionService.startSession(yearOfStudy, codingExperience);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/end-session")
    public ResponseEntity<Session> endSession(@RequestBody Map<String, String> payload) {
        Long sessionId = Long.valueOf(payload.get("sessionId"));
        Optional<Session> sessionOpt = sessionService.endSession(sessionId);

        return sessionOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.badRequest().build());
    }
}
