package com.backend.authentication.repository;

import com.backend.authentication.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, String> {
}
