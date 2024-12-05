package com.backend.authentication.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.authentication.dto.response.ApiResponse;
import com.backend.authentication.dto.response.CreatePostResponse;
import com.backend.authentication.dto.response.NotificationResponse;
import com.backend.authentication.service.NotificationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/noti")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
    NotificationService notificationService;

    @MessageMapping("/friend/request")
    @SendTo("/topic/notifications")
    public String notifyFriendRequest(String message) {
        return message;
    }

    @GetMapping("/receiver/{receiverId}")
    public ApiResponse<List<NotificationResponse>> getNotisByUserId(@PathVariable Long receiverId){
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getNotisByUserId(receiverId))
                .build();
    }

    @PostMapping("/delete/{notiId}")
    public ApiResponse<Void> deleteNotiById(@PathVariable Long notiId) {
        notificationService.deleteNotiById(notiId);
        return ApiResponse.<Void>builder().build();
    }
}
