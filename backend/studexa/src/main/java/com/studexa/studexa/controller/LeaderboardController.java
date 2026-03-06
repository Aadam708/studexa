package com.studexa.studexa.controller;

import com.studexa.studexa.dto.LeaderboardEntryDto;
import com.studexa.studexa.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyLeaderboard() {
        try {
            List<LeaderboardEntryDto> entries = leaderboardService.getLeaderboardForCurrentUser();
            return ResponseEntity.ok(entries);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
