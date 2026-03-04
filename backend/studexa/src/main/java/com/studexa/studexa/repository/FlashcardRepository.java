package com.studexa.studexa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.studexa.studexa.entity.Flashcard;


@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard,Long> {

    public List <Flashcard> findByDocumentId(Long documentId);



}
