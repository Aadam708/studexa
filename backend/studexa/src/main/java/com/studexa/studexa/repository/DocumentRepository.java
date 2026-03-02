package com.studexa.studexa.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.studexa.studexa.entity.Document;
import com.studexa.studexa.entity.User;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document,Long> {

    public List<Document> findByTitle(String title);
    public List<Document> findBySubject_User(User user);


}
