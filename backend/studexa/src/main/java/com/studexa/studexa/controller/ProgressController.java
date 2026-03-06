package com.studexa.studexa.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.studexa.studexa.dto.ProgressUpdateRequest;
import com.studexa.studexa.service.ProgressService;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    //this will update/save the flashcard progress 
    @PostMapping("/update")
    public ResponseEntity<?> updateProgress(@RequestBody ProgressUpdateRequest request) {
        try {
            progressService.updateProgress(request.getFlashcardId(), request.isCorrect());
            return ResponseEntity.ok(Map.of("message", "Progress successfully updated"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
