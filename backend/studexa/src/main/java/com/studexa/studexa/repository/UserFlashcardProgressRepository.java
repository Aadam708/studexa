package com.studexa.studexa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.studexa.studexa.entity.UserFlashcardProgress;
import com.studexa.studexa.entity.UserFlashcardProgressId;

@Repository
public interface UserFlashcardProgressRepository extends JpaRepository<UserFlashcardProgress, UserFlashcardProgressId> {
}
