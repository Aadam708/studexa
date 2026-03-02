package com.studexa.studexa.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.studexa.studexa.dto.DocumentDto;
import com.studexa.studexa.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDocument(@RequestBody Map<String, String> payload) {
        try {
            Long subjectId = Long.parseLong(payload.get("subjectId"));
            String title = payload.get("title");
            String filePath = payload.get("filePath"); 

            if (title == null || title.isEmpty() || filePath == null || filePath.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Title and filePath are required"));
            }

            DocumentDto createdDoc = documentService.create(subjectId, title, filePath);
            return ResponseEntity.ok(createdDoc);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid Subject ID format"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<DocumentDto>> getUserDocuments() {
        return ResponseEntity.ok(documentService.findUserDocuments());
    }
}
