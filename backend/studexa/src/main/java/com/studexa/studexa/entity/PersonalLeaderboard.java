package com.studexa.studexa.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.Immutable;
import java.time.LocalDateTime;

@Getter
@Entity
@Immutable
@Table(name = "personalleaderboard")
public class PersonalLeaderboard {

    @Id
    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "subject_name")
    private String subjectName;

    @Column(name = "cards_studied")
    private Long cardsStudied;

    @Column(name = "total_successes")
    private Long totalSuccesses;

    @Column(name = "total_failures")
    private Long totalFailures;

    @Column(name = "points")
    private Long points;

    @Column(name = "accuracy_percentage")
    private Double accuracyPercentage;

    @Column(name = "last_studied")
    private LocalDateTime lastStudied;
}
