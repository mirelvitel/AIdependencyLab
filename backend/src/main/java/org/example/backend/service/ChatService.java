package org.example.backend.service;

import org.example.backend.entity.ChatMessage;
import org.example.backend.entity.Session;
import org.example.backend.persistence.ChatMessageRepository;
import org.example.backend.persistence.SessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ChatService {

    @Value("${openai.api-key}")
    private String openaiApiKey;

    private final SessionRepository sessionRepository;
    private final ChatMessageRepository chatMessageRepository;

    public ChatService(SessionRepository sessionRepository, ChatMessageRepository chatMessageRepository) {
        this.sessionRepository = sessionRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public String getChatReply(String message, Long sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return "Invalid session";
        }
        Session session = sessionOpt.get();

        ChatMessage userMessage = new ChatMessage();
        userMessage.setSession(session);
        userMessage.setRole("user");
        userMessage.setContent(message);
        chatMessageRepository.save(userMessage);

        List<ChatMessage> history = chatMessageRepository.findBySessionOrderByCreatedAtAsc(session);
        List<Map<String, String>> messagesList = new ArrayList<>();

        messagesList.add(Map.of("role", "system", "content", "You are a helpful assistant."));

        for (ChatMessage cm : history) {
            messagesList.add(Map.of("role", cm.getRole(), "content", cm.getContent()));
        }

        Map<String, Object> requestPayload = new HashMap<>();
        requestPayload.put("model", "gpt-4");
        requestPayload.put("messages", messagesList);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestPayload, headers);
        RestTemplate restTemplate = new RestTemplate();
        String openaiUrl = "https://api.openai.com/v1/chat/completions";

        ResponseEntity<Map> responseEntity = restTemplate.exchange(openaiUrl, HttpMethod.POST, entity, Map.class);
        Map<String, Object> response = responseEntity.getBody();

        String reply = "No reply";
        if (response != null && response.containsKey("choices")) {
            List<?> choices = (List<?>) response.get("choices");
            if (!choices.isEmpty()) {
                Map<String, Object> firstChoice = (Map<String, Object>) choices.get(0);
                Map<String, Object> messageMap = (Map<String, Object>) firstChoice.get("message");
                if (messageMap != null && messageMap.containsKey("content")) {
                    reply = messageMap.get("content").toString();
                }
            }
        }

        ChatMessage assistantMessage = new ChatMessage();
        assistantMessage.setSession(session);
        assistantMessage.setRole("assistant");
        assistantMessage.setContent(reply);
        chatMessageRepository.save(assistantMessage);

        return reply;
    }
}
