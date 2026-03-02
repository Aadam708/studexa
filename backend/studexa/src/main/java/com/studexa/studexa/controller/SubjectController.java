package com.studexa.studexa.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.studexa.studexa.dto.SubjectDto;
import com.studexa.studexa.entity.Subject;
import com.studexa.studexa.service.SubjectService;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    // GET /api/subjects - Get all subjects for logged-in user
    @GetMapping
    public ResponseEntity<List<SubjectDto>> getSubjects() {
        return ResponseEntity.ok(subjectService.getUserSubjects());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createSubject(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");

        if (name == null || name.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Subject name is required"));
        }

        try {
            Subject created = subjectService.createSubject(name);
            return ResponseEntity.ok(Map.of(
                "id", created.getId(),
                "name", created.getName()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Could not save subject"));
        }
    }
}
