package com.studexa.studexa.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProgressUpdateRequest {
    private Long flashcardId;

    @JsonProperty("isCorrect")
    private boolean isCorrect;
}
