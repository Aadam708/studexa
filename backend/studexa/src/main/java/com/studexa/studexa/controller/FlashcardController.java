package com.studexa.studexa.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studexa.studexa.entity.Document;
import com.studexa.studexa.entity.Flashcard;
import com.studexa.studexa.repository.DocumentRepository;
import com.studexa.studexa.repository.FlashcardRepository;
import com.studexa.studexa.service.GeminiService;
import com.studexa.studexa.service.GoogleDriveService;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FlashcardController {

    private final GoogleDriveService driveService;
    private final GeminiService geminiService;
    private final FlashcardRepository flashcardRepository;
    private final DocumentRepository documentRepository;
    private final ObjectMapper objectMapper;

    //for now i will inject repo just cos im saving but to view flashcards will make a service class to inject here instead
    public FlashcardController(GoogleDriveService driveService, GeminiService geminiService,
                               FlashcardRepository flashcardRepository, DocumentRepository documentRepository) {
        this.driveService = driveService;
        this.geminiService = geminiService;
        this.flashcardRepository = flashcardRepository;
        this.documentRepository = documentRepository;
        this.objectMapper = new ObjectMapper();
    }

    //this will also be moved inside a flashcard sevice class in future commit
    private String getUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            return auth.getName();
        }
        throw new RuntimeException("User is not logged in!");
    }

    //this is just passing in the generated json for the flashcards to be stored in the db flashcard table
    @PostMapping("/generate")
    public CompletableFuture<ResponseEntity<String>> generateFlashcards(@RequestBody Map<String, String> payload) {
        String userId = getUserId();
        String fileId = payload.get("driveFileId");
        String subject = payload.get("subject");

        //getting the document id which was just created so its in the payload for the user currently
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
            // after gemini returns the json we save to the db
            if (documentId != null) {
                try {
                    // fetching the Document that was just created by gemini
                    Document document = documentRepository.findById(documentId)
                            .orElseThrow(() -> new RuntimeException("Document not found with ID: " + documentId));

                    //parsing the JSON string from Gemini
                    JsonNode root = objectMapper.readTree(jsonResponse);
                    JsonNode cardsNode = root.path("cards");

                    //looping through the array and building the Flashcard entities using the setters
                    if (cardsNode.isArray()) {
                        List<Flashcard> flashcardsToSave = new ArrayList<>();
                        for (JsonNode cardNode : cardsNode) {
                            String frontText = cardNode.path("front").asText();
                            String backText = cardNode.path("back").asText();

                            Flashcard flashcard = new Flashcard();
                            flashcard.setDocument(document);
                            flashcard.setFrontText(frontText);// Assuming your Entity has setFront() and setBack()
                            flashcard.setBackText(backText);
                            flashcardsToSave.add(flashcard);
                        }
                        // saving them all to the database will change to use the service class later
                        //this is for testing that it actually works to save them to my db
                        flashcardRepository.saveAll(flashcardsToSave);
                        System.out.println("Successfully saved " + flashcardsToSave.size() + " flashcards to DB!");
                    }
                } catch (Exception e) {
                    System.err.println("Failed to parse and save flashcards: " + e.getMessage());
                    e.printStackTrace();
                    throw new RuntimeException("Flashcards generated but failed to save to Database.", e);
                }
            }

            return ResponseEntity.ok(jsonResponse);

        }).exceptionally(ex -> {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().body("Error generating cards: " + ex.getMessage());
        });
    }
}
