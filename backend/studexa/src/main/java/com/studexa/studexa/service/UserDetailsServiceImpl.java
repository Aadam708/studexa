package com.studexa.studexa.service;

import com.studexa.studexa.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    public UserDetailsServiceImpl(UserRepository userRepository) { this.userRepository = userRepository; }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.studexa.studexa.entity.User u = userRepository.findByEmail(email);
        if (u == null) throw new UsernameNotFoundException("User not found: " + email);
        return User.withUsername(u.getEmail())
                .password(u.getPasswordHash())
                .authorities("ROLE_" + (u.getRole() == null ? "STUDENT" : u.getRole().toUpperCase()))
                .build();
    }
}
