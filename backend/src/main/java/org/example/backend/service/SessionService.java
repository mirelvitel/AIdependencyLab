package org.example.backend.service;

import org.example.backend.entity.Session;
import org.example.backend.entity.User;
import org.example.backend.persistence.ExerciseRepository;
import org.example.backend.persistence.SessionRepository;
import org.example.backend.persistence.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SessionService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final ExerciseRepository exerciseRepository;

    public SessionService(UserRepository userRepository,
                          SessionRepository sessionRepository,
                          ExerciseRepository exerciseRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.exerciseRepository = exerciseRepository;
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

    @Scheduled(cron = "0 * * * * *")
    public void deleteStaleSessions() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(60);
        List<Session> stale = sessionRepository.findByEndTimeIsNullAndStartTimeBefore(cutoff);
        for (Session session : stale) {
            exerciseRepository.deleteAll(exerciseRepository.findBySession(session));
            sessionRepository.delete(session);
        }
    }
}
