package org.example.backend.entity;

public enum InteractionType {
    CODE_RUN,            // When the run code button is pressed
    CODE_EDIT,           // When the user modifies code in the editor
    TASK_SUBMIT,         // When the user submits a completed task
    AI_CODE_GENERATION,  // When the AI request is for generating code
    AI_DEBUG,            // When the AI request is for debugging code
    AI_THEORY_EXPLANATION,// When the AI request is for explaining theory or concepts
    AI_GENERAL_QUERY     // When the AI request is a general query
}