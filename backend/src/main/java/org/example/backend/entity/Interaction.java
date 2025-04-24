package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "interaction")
public class Interaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long interactionId;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private InteractionType actionType;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String details;

    public Interaction() {
        this.timestamp = LocalDateTime.now();
    }
}
