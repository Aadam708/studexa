package com.studexa.studexa.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LeaderboardEntryDto {
    private String subjectName;
    private Long cardsStudied;
    private Long totalSuccesses;
    private Long totalFailures;
    private Long points;
    private Double accuracyPercentage;
    private String lastStudied;
}
