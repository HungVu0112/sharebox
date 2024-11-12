package com.backend.authentication.repository;

import com.backend.authentication.entity.CustomFeed;
import com.backend.authentication.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomFeedRepository extends JpaRepository<CustomFeed, Long> {
    List<CustomFeed> findByOwner(User user);
}
