package com.campusplace.repository;

import com.campusplace.entity.Profile;
import com.campusplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByUser(User user);
}