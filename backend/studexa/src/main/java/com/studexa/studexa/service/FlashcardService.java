package com.studexa.studexa.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studexa.studexa.dto.FlashcardDto;
import com.studexa.studexa.entity.Document;
import com.studexa.studexa.entity.Flashcard;
import com.studexa.studexa.entity.User;
import com.studexa.studexa.repository.DocumentRepository;
import com.studexa.studexa.repository.FlashcardRepository;
import com.studexa.studexa.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public FlashcardService(FlashcardRepository flashcardRepository, DocumentRepository documentRepository, UserRepository userRepository) {
        this.flashcardRepository = flashcardRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.objectMapper = new ObjectMapper();
    }
    // method from my other sevices to find the current user from the token
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        return user;
    }


    //the logic has been placed in this method as it is from the controller in my previous commit
    public void saveFlashcardsFromJson(Long documentId, String jsonResponse) {
        try {
            Document document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new RuntimeException("Document not found with ID: " + documentId));

            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode cardsNode = root.path("cards");

            if (cardsNode.isArray()) {
                List<Flashcard> flashcardsToSave = new ArrayList<>();
                for (JsonNode cardNode : cardsNode) {
                    Flashcard flashcard = new Flashcard();
                    flashcard.setDocument(document);
                    flashcard.setFrontText(cardNode.path("front").asText());
                    flashcard.setBackText(cardNode.path("back").asText());
                    flashcardsToSave.add(flashcard);
                }
                flashcardRepository.saveAll(flashcardsToSave);
                System.out.println("Successfully saved " + flashcardsToSave.size() + " flashcards to DB!");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse and save flashcards", e);
        }
    }

    public List<FlashcardDto> getFlashcardsByDocument(Long documentId) {
        User currentUser = getCurrentUser();

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        // making sure the documents subject belongs to the current user so no user views  other ppls documents
        if (!document.getSubject().getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You do not have permission to view these flashcards");
        }

        List<Flashcard> flashcards = flashcardRepository.findByDocumentId(documentId);
        List<FlashcardDto> dtos = new ArrayList<>();
        for (Flashcard card : flashcards) {
            FlashcardDto dto = FlashcardDto.builder()
                    .id(card.getId())
                    .documentId(card.getDocument().getId())
                    .frontText(card.getFrontText())
                    .backText(card.getBackText())
                    .build();
            dtos.add(dto);
        }
        return dtos;
    }
}
