package com.studexa.studexa.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SubjectDto {
    private Long id;
    private String name;
    private Long userId;
    private LocalDateTime createdAt;
}
