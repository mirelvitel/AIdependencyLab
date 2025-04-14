package org.example.backend.service;

import org.example.backend.entity.Session;
import org.example.backend.entity.User;
import org.example.backend.persistence.SessionRepository;
import org.example.backend.persistence.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SessionService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    public SessionService(UserRepository userRepository, SessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    public Session startSession(String yearOfStudy, String codingExperience) {

        User user = new User();
        user.setYearOfStudy(yearOfStudy);
        user.setCodingExperience(codingExperience);
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        Session session = new Session();
        session.setUser(user);
        session.setStartTime(LocalDateTime.now());
        sessionRepository.save(session);

        return session;
    }

    public Optional<Session> endSession(Long sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setEndTime(LocalDateTime.now());
            sessionRepository.save(session);
        }
        return sessionOpt;
    }
}
