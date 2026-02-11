
package com.studexa.studexa.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.studexa.studexa.enums.Difficulty;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "flashcards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "card_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "front_text", nullable = false, length = 255)
    private String frontText;

    @Column(name = "back_text", nullable = false, length = 255)
    private String backText;

    @Enumerated(EnumType.STRING)  // Stores "easy", "medium", "hard" as strings
    @Column(name = "difficulty", nullable = false, length = 255)
    private Difficulty difficulty;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Bidirectional relationship
    @OneToMany(mappedBy = "flashcard", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserFlashcardProgress> progressRecords = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();

        if (difficulty == null) {
            difficulty = Difficulty.medium;
        }
    }
}
