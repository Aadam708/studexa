package com.studexa.studexa.repository;

import com.studexa.studexa.entity.PersonalLeaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalLeaderboardRepository extends JpaRepository<PersonalLeaderboard, Long> {
    List<PersonalLeaderboard> findByUserIdOrderByAccuracyPercentageDesc(Long userId);
}
