package com.studexa.studexa.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

import com.studexa.studexa.dto.UserDto;
import com.studexa.studexa.entity.User;
import com.studexa.studexa.mapper.UserMapperImpl;
import com.studexa.studexa.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapperImpl userMapper;

    public UserDto findByEmail(String email){

        return userMapper.toDto(userRepository.findByEmail(email));
    }

    public UserDto register(User user){

        user.setEmail(user.getEmail().toLowerCase().trim());

         //checking ig the user already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists please use a different email");
        }

         //hashing the password

         BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
         String passwordHash = encoder.encode(user.getPassword());

         //storing the password hash in user entity

         user.setPasswordHash(passwordHash);

         try {
             User savedUser = userRepository.save(user);
             return userMapper.toDto(savedUser);
         } catch (DataIntegrityViolationException e) {
             throw new IllegalArgumentException("Email already exists");
         }
     }

}
