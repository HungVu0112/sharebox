package com.backend.authentication.repository;

import com.backend.authentication.entity.Notification;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    @Query("SELECT n FROM Notification n WHERE n.receiverId = :receiverId")
    List<Notification> getNotiByUserId(@Param("receiverId") Long receiverId);
}
