package com.studexa.studexa.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;

import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DocumentDto {

    private final Long id;
    private final Long subjectId;
    private final String title;

}
