package com.studexa.studexa.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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

        //hashing the password

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String passwordHash = encoder.encode(user.getPassword());

        //storing the password hash in user entity

        user.setPasswordHash(passwordHash);

        User savedUser = userRepository.save(user);

        return userMapper.toDto(savedUser);
    }

}
