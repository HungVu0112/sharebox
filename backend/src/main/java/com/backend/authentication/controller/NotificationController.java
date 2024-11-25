package com.backend.authentication.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationController {
    @MessageMapping("/friend/request")
    @SendTo("/topic/notifications")
    public String notifyFriendRequest(String message) {
        return message;
    }
}
