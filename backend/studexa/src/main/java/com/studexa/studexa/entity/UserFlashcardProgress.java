package com.studexa.studexa.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "userflashcardprogress")
@IdClass(UserFlashcardProgressId.class)  // Composite primary key
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFlashcardProgress {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Flashcard flashcard;

    @Column(name = "last_attempted")
    private LocalDateTime lastAttempted;

    @Column(name = "success_count", nullable = false)
    private Integer successCount = 0;

    @Column(name = "failure_count", nullable = false)
    private Integer failureCount = 0;

    @Column(name = "streak_count", nullable = false)
    private Integer streakCount = 0;

    @Column(name = "next_review")
    private LocalDateTime nextReview;

    @PrePersist
    protected void setDefaults() {
        if (successCount == null) successCount = 0;
        if (failureCount == null) failureCount = 0;
        if (streakCount == null) streakCount = 0;
    }
}
