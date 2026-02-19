package com.studexa.studexa.controller;

import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;

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
    public ResponseEntity<?> register(@RequestBody User user) {

        try{
            UserDto dto = this.userService.register(user);
            return ResponseEntity.ok(dto);

        }catch(IllegalArgumentException e){
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));

        }catch(DataIntegrityViolationException e){
            return ResponseEntity.status(409).body(Map.of("message", "Email already Exists"));

        }catch (Exception e){
            return ResponseEntity.status(500).body(Map.of("message", "Error Registration failed"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {


        //for more security using spring security authentication manager
        try{
            authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            //generating a jwt with the email as its username
            String token = jwtUtil.generateToken(request.getEmail());

            //returning a http cookie which stores the jwt (for local this is fine but later needs to be https)
            ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(60*60)
                .sameSite("None")
                .build();

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Authenticated"));

                //if a user doesnt exist then it will throw this bad credentials 401 response
        }catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));

            //for an internal server error
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("message", "Login failed"));
        }

    }

    //clearing all cookies for when user wants to logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(){
       ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "logged out successfully"));
    }




}
