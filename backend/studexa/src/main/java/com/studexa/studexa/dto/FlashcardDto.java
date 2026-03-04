package com.studexa.studexa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class FlashcardDto {
    private final Long id;
    private final Long documentId;
    private final String frontText;
    private final String backText;
}
