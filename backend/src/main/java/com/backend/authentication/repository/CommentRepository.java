package com.backend.authentication.repository;

import com.backend.authentication.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    Long getTotalComments(@Param("postId") Long postId);

    List<Comment> findByPostId(Long postId);

    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.parentComment IS NULL")
    List<Comment> findAllParentComments(@Param("postId") Long postId);

    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.parentComment.id = :parentCommentId")
    List<Comment> findChildCommentsByParentId(@Param("postId") Long postId, @Param("parentCommentId") Long parentCommentId);

}
