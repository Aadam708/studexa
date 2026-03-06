package com.studexa.studexa.service;

import com.studexa.studexa.dto.LeaderboardEntryDto;
import com.studexa.studexa.entity.PersonalLeaderboard;
import com.studexa.studexa.entity.User;
import com.studexa.studexa.repository.PersonalLeaderboardRepository;
import com.studexa.studexa.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    private final PersonalLeaderboardRepository leaderboardRepository;
    private final UserRepository userRepository;

    public LeaderboardService(PersonalLeaderboardRepository leaderboardRepository, UserRepository userRepository) {
        this.leaderboardRepository = leaderboardRepository;
        this.userRepository = userRepository;
    }

    public List<LeaderboardEntryDto> getLeaderboardForCurrentUser() {
        //getting the email from http jwt cookie as all i do in all controllers for security
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);

        List<PersonalLeaderboard> entries = leaderboardRepository
                .findByUserIdOrderByAccuracyPercentageDesc(user.getId());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");


        //converting each item in the list to a dto then adding these dtos in a list
        return entries.stream().map(e -> new LeaderboardEntryDto(
                e.getSubjectName(),
                e.getCardsStudied(),
                e.getTotalSuccesses(),
                e.getTotalFailures(),
                e.getPoints(),
                e.getAccuracyPercentage(),
                e.getLastStudied() != null ? e.getLastStudied().format(formatter) : "Not studied yet"
        )).collect(Collectors.toList());
    }
}
