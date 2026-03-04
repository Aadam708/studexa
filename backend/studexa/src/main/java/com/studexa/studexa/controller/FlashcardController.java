package com.studexa.studexa.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import com.studexa.studexa.service.FlashcardService;
import com.studexa.studexa.service.GeminiService;
import com.studexa.studexa.service.GoogleDriveService;
import com.studexa.studexa.dto.FlashcardDto;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FlashcardController {

    private final GoogleDriveService driveService;
    private final GeminiService geminiService;
    private final FlashcardService flashcardService;

    // updated to use the flashcard service class i made after previous commit
    public FlashcardController(GoogleDriveService driveService, GeminiService geminiService, FlashcardService flashcardService) {
        this.driveService = driveService;
        this.geminiService = geminiService;
        this.flashcardService = flashcardService;
    }

    private String getUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            return auth.getName();
        }
        throw new RuntimeException("User is not logged in!");
    }

    @PostMapping("/generate")
    public CompletableFuture<ResponseEntity<String>> generateFlashcards(@RequestBody Map<String, String> payload) {
        String userId = getUserId();
        String fileId = payload.get("driveFileId");
        String subject = payload.get("subject");

        String documentIdStr = payload.get("documentId");
        Long documentId = documentIdStr != null ? Long.parseLong(documentIdStr.toString()) : null;

        return CompletableFuture.supplyAsync(() -> {
            try {
                String fileContent = driveService.downloadFileContent(userId, fileId);
                return geminiService.generateFlashcards(fileContent, subject).join();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).thenApply(jsonResponse -> {
            //simplified the code for saving here as now the service class i made will handle the
            //logic of converting the json into a flashcard object to be saved
            if (documentId != null) {
                flashcardService.saveFlashcardsFromJson(documentId, jsonResponse);
            }
            return ResponseEntity.ok(jsonResponse);

        }).exceptionally(ex -> {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().body("Error generating cards: " + ex.getMessage());
        });
    }

    //  adding a GET endpoint to fetch flashcards by document ID returning the dtos for better secuirty
    @GetMapping("/{documentId}")
    public ResponseEntity<?> getFlashcards(@PathVariable Long documentId) {
        try {
            List<FlashcardDto> cards = flashcardService.getFlashcardsByDocument(documentId);
            return ResponseEntity.ok(cards);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }
}
