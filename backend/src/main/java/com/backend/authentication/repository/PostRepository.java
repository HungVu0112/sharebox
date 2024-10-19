package com.backend.authentication.repository;

import com.backend.authentication.entity.Post;
import com.backend.authentication.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Long countByUser(User user);

    @Query("SELECT p FROM Post p " +
            "WHERE p.user.userId = :userId")
    List<Post> getAllPost(@Param("userId") Long userId);

    @Query("SELECT p FROM Post p JOIN p.postTopic t WHERE t.id = :topicId")
    List<Post> getPostByDistinctTopic(@Param("topicId") Long topicId);

    @Query("SELECT p FROM Post p JOIN p.postTopic t WHERE t.id IN :topicsId")
    List<Post> getPostByTopics(@Param("topicsId") List<Long> topicsId);
}
