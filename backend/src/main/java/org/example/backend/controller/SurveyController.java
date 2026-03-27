package org.example.backend.controller;

import org.example.backend.entity.Session;
import org.example.backend.entity.Survey;
import org.example.backend.persistence.SessionRepository;
import org.example.backend.persistence.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class SurveyController {

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @PostMapping("/save-survey")
    public ResponseEntity<Survey> saveSurvey(@RequestBody Map<String, String> payload) {
        Long sessionId = Long.valueOf(payload.get("sessionId"));
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Session session = sessionOpt.get();

        Survey survey = new Survey();
        survey.setSession(session);

        survey.setQ1(payload.get("q1"));
        survey.setQ2(payload.get("q2"));
        survey.setQ3(payload.get("q3"));
        survey.setQ4(payload.get("q4"));
        survey.setQ5(payload.get("q5"));

        surveyRepository.save(survey);
        return ResponseEntity.ok(survey);
    }
}
