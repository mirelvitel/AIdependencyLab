package org.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
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
    @JsonBackReference
    private Session session;

    @Enumerated(EnumType.STRING)
    private ExerciseComplexity complexity;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    private Boolean isAiEnabled;
    private Boolean completed;
    private String completionTime;
    private Boolean success;

    @OneToMany(
            mappedBy = "exercise",
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<Interaction> interactions = new ArrayList<>();

    public Exercise() {}
}
