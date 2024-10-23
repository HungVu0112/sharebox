package com.backend.authentication.repository;

import com.backend.authentication.entity.Post;
import com.backend.authentication.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    @Query("SELECT CASE WHEN COUNT(v) > 0 THEN TRUE ELSE FALSE END FROM Vote v WHERE v.post.id = :postId AND v.user.id = :userId")
    boolean existsByPostIdAndUserId(@Param("postId") Long postId, @Param("userId") Long userId);


    @Query("SELECT v FROM Vote v WHERE v.post.id = :postId AND v.user.id = :userId")
    Vote findByPostIdAndUserId(@Param("postId") Long postId, @Param("userId") Long userId);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.post = :post AND v.voteType = 'UPVOTE'")
    int countUpvotesByPost(Post post);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.post = :post AND v.voteType = 'DOWNVOTE'")
    int countDownvotesByPost(Post post);
}
