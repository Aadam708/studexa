package com.studexa.studexa.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studexa.studexa.dto.AuthResponse;
import com.studexa.studexa.dto.LoginRequest;
import com.studexa.studexa.dto.UserDto;
import com.studexa.studexa.entity.User;
import com.studexa.studexa.security.JwtUtil;
import com.studexa.studexa.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {


    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService,AuthenticationManager
                          authenticationManager, JwtUtil jwtUtil)
         {
            this.userService = userService;
            this.authenticationManager = authenticationManager;
            this.jwtUtil = jwtUtil;
        }

    @PostMapping("/register")
    public UserDto register(@RequestBody User user) {

        return this.userService.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = jwtUtil.generateToken(request.getEmail());
        return new AuthResponse(token);
    }


}
