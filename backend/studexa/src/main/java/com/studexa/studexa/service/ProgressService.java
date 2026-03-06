package com.studexa.studexa.service;

import java.time.LocalDateTime;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.studexa.studexa.entity.Flashcard;
import com.studexa.studexa.entity.User;
import com.studexa.studexa.entity.UserFlashcardProgress;
import com.studexa.studexa.entity.UserFlashcardProgressId;
import com.studexa.studexa.repository.FlashcardRepository;
import com.studexa.studexa.repository.UserFlashcardProgressRepository;
import com.studexa.studexa.repository.UserRepository;

@Service
public class ProgressService {

    private final UserFlashcardProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final FlashcardRepository flashcardRepository;

    public ProgressService(UserFlashcardProgressRepository progressRepository, UserRepository userRepository, FlashcardRepository flashcardRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.flashcardRepository = flashcardRepository;
    }

    public void updateProgress(Long flashcardId, boolean isCorrect) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);

        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));

        //since its a composite pk i need to make a new id with both these ids as values
        UserFlashcardProgressId id = new UserFlashcardProgressId(user.getId(), flashcard.getId());

        // finding if a progress for this flashcard progress exists in my db
        UserFlashcardProgress progress = progressRepository.findById(id)
                .orElse(new UserFlashcardProgress(user, flashcard, null, 0, 0, 0, null));

        // updating my timestamp to show that its just been updated by the user current time they click
        progress.setLastAttempted(LocalDateTime.now());

        //if its correct i update both the success and streak by 1
        if (isCorrect) {
            progress.setSuccessCount(progress.getSuccessCount() + 1);
            progress.setStreakCount(progress.getStreakCount() + 1);


        //if its incorrect strak resets to 0 and i update fail count
        } else {
            progress.setFailureCount(progress.getFailureCount() + 1);
            progress.setStreakCount(0); // Reset streak on failure
        }

        //saving the progress it will update if i already found an entity as i didnt make a new entiy if i found one
        progressRepository.save(progress);
    }
}
