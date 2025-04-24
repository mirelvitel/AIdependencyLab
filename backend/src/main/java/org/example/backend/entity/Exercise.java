package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
@Entity
@Table(name = "exercise")
@AllArgsConstructor
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long exerciseId;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Enumerated(EnumType.STRING)
    private ExerciseComplexity complexity;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    private Boolean isAiEnabled;
    private Boolean completed;
    private String completionTime;
    private Boolean success;

    public Exercise() {}
}
