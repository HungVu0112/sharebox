package com.backend.authentication.repository;

import com.backend.authentication.entity.Favorite;
import com.backend.authentication.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    @Query("SELECT f.post FROM Favorite f WHERE f.user.userId = :userId")
    List<Post> findByUserId(@Param("userId") Long userId);

    @Query("SELECT f FROM Favorite f WHERE f.user.userId = :userId AND f.post.id = :postId")
    Optional<Favorite> findByUserIdAndPostId(@Param("userId") Long userId, @Param("postId") Long postId);
}
