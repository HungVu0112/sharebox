package com.backend.authentication.repository;

import com.backend.authentication.entity.ChatRoom;
import com.backend.authentication.entity.Comment;
import com.backend.authentication.entity.Message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE m.chatroom.chatroomId = :chatroomId ORDER BY m.createAt ASC")
    List<Message> findByChatroomId(@Param("chatroomId") Long chatroomId);

    @Query("SELECT m FROM Message m WHERE m.chatroom.chatroomId = :chatroomId ORDER BY m.createAt DESC")
    Page<Message> findLatestMessageByChatroomId(
        @Param("chatroomId") Long chatroomId, 
        Pageable pageable
    );

    @Modifying
    @Query("UPDATE Message m SET m.seen = true " +
           "WHERE m.chatroom.chatroomId = :chatroomId " +
           "AND m.receiver.userId = :userId " +
           "AND m.seen = false")
    int updateUnseenMessagesByChatroomAndReceiver(
        @Param("chatroomId") Long chatroomId, 
        @Param("userId") Long userId
    );
}
