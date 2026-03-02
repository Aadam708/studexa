package com.studexa.studexa.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.studexa.studexa.dto.SubjectDto;
import com.studexa.studexa.entity.Subject;
import com.studexa.studexa.entity.User;
import com.studexa.studexa.repository.SubjectRepository;
import com.studexa.studexa.repository.UserRepository;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;


    public SubjectService(SubjectRepository subjectRepository, UserRepository userRepository) {
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }


    public Subject createSubject(String subjectName){

        User user = getCurrentUser();

        //preventing the user making duplicate subjects
        if(subjectRepository.existsByNameAndUser(subjectName, user)){
            throw new IllegalArgumentException("Subject already exists for this user");
        }


        Subject subject = new Subject();
        subject.setUser(user);
        subject.setName(subjectName);
        Subject savedSubject = subjectRepository.save(subject);
        return savedSubject;
    }

    //returning all subhjects related to the user
    public List<SubjectDto> getUserSubjects(){

        User user = getCurrentUser();
        List<Subject> subjects = subjectRepository.findByUser(user);
        List<SubjectDto> subjectDtos = new ArrayList<>();

        //converting all the subjects into dtos so user only sees certain info
        for(Subject subject :subjects){


            SubjectDto subjectDto = new SubjectDto
                (
                    subject.getId(),
                    subject.getName(),
                    subject.getUser().getId(),
                    subject.getCreatedAt()
                );

            subjectDtos.add(subjectDto);

        }

        return subjectDtos;


    }

    //getting the current user using their email stored in their jwt
    private User getCurrentUser(){

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("user not found");
        }
        return user;
    }

}
