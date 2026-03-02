package com.studexa.studexa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.studexa.studexa.entity.Subject;
import com.studexa.studexa.entity.User;

@Repository
public interface SubjectRepository extends JpaRepository<Subject,Long> {

    Subject findByid(Long id);
    List<Subject> findByUser(User user);
    boolean existsByNameAndUser(String name, User user);


}
