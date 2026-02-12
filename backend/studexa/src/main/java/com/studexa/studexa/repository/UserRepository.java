package com.studexa.studexa.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studexa.studexa.entity.User;


public interface UserRepository extends JpaRepository<User, Long>{

    User findByEmail(String email);

}
