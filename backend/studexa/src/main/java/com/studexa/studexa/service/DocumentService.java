package com.studexa.studexa.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.studexa.studexa.dto.DocumentDto;
import com.studexa.studexa.entity.Document;
import com.studexa.studexa.entity.Subject;
import com.studexa.studexa.entity.User;
import com.studexa.studexa.repository.DocumentRepository;
import com.studexa.studexa.repository.SubjectRepository;
import com.studexa.studexa.repository.UserRepository;

@Service
public class DocumentService {

    private final SubjectRepository subjectRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;




    public DocumentService( SubjectRepository subjectRepository,
                            DocumentRepository documentRepository,
                            UserRepository userRepository
                        ) {
        this.subjectRepository = subjectRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }




    public DocumentDto create(Long subjectId, String title, String filePath) {
        User currentUser = getCurrentUser();
        Subject subject = subjectRepository.findByid(subjectId);

        if (subject == null) {
            throw new IllegalArgumentException("Could not find matching subject");
        }

        //making sure its only adding documents to this current users subjects
        if (!subject.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You do not have permission to add a document to this subject.");
        }

        Document savedDocument = new Document();
        savedDocument.setSubject(subject);
        savedDocument.setTitle(title);
        savedDocument.setFilePath(filePath);

        Document saved = documentRepository.save(savedDocument);

        return new DocumentDto(saved.getId(), saved.getSubject().getId(), saved.getTitle());
    }

    public List<DocumentDto> findUserDocuments(){

        User currentUser = getCurrentUser();

        //finding all the current users documents using subject entity

        List<Document> documents = documentRepository.findBySubject_User(currentUser);

        List<DocumentDto> documentDtos = new ArrayList<>();

        for(Document document :documents){

            DocumentDto documentDto =
                            DocumentDto.builder()
                                .id(document.getId())
                                .subjectId(document.getSubject().getId())
                                .title(document.getTitle())
                                .build();

            documentDtos.add(documentDto);
        }

        return documentDtos;


    }

    private User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email);

        if(user ==null){
            throw new IllegalArgumentException("User not found");

        }

        return user;


    }

}
