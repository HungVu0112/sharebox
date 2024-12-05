package com.backend.authentication.repository;

import com.backend.authentication.entity.ChatRoom;
import com.backend.authentication.entity.Comment;
import com.backend.authentication.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatroomRepository extends JpaRepository<ChatRoom, Long> {
    @Query("SELECT c FROM ChatRoom c WHERE " +
           "(c.user1 = :user1 AND c.user2 = :user2) OR " +
           "(c.user1 = :user2 AND c.user2 = :user1)")
    Optional<ChatRoom> findByUser1AndUser2OrUser2AndUser1(
        @Param("user1") User user1, 
        @Param("user2") User user2
    );

    @Query("SELECT c FROM ChatRoom c WHERE c.user1.userId = :userId OR c.user2.userId = :userId")
    List<ChatRoom> findAllChatroomsByUserId(@Param("userId") Long userId);
}
