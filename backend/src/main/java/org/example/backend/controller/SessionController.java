package org.example.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.backend.entity.Session;
import org.example.backend.entity.User;
import org.example.backend.persistence.SessionRepository;
import org.example.backend.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class SessionController {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private SessionRepository sessionRepository;

    @PostMapping("/start-session")
    public ResponseEntity<Session> startSession(@RequestBody Map<String, String> payload) {

        User user = new User();
        user.setFirstName(payload.get("firstName"));
        user.setLastName(payload.get("lastName"));
        user.setYearOfStudy(payload.get("yearOfStudy"));
        user.setCodingExperience(payload.get("codingExperience"));
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        Session session = new Session();
        session.setUser(user);
        session.setStartTime(LocalDateTime.now());
        sessionRepository.save(session);

        return ResponseEntity.ok(session);
    }
}
