package org.example.backend.persistence;

import org.example.backend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findByEndTimeIsNullAndStartTimeBefore(LocalDateTime cutoff);
}
