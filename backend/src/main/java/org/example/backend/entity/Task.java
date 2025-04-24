package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String testCases;

    private String title;
    private String complexity;
    private Boolean isAIEnabled;

    public Task() {
    }

    public Task(String title, String description, String testCases, String complexity, Boolean isAIEnabled) {
        this.title = title;
        this.description = description;
        this.testCases = testCases;
        this.complexity = complexity;
        this.isAIEnabled = isAIEnabled;
    }
}
