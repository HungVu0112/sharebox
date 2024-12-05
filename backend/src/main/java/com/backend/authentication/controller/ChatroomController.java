package com.backend.authentication.controller;

import com.backend.authentication.dto.request.*;
import com.backend.authentication.dto.response.ApiResponse;
import com.backend.authentication.dto.response.ChatroomResponse;
import com.backend.authentication.dto.response.UserAccountResponse;
import com.backend.authentication.entity.User;
import com.backend.authentication.enums.ChatRoomStatus;
import com.backend.authentication.service.ChatroomService;
import com.backend.authentication.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.apache.tomcat.util.codec.binary.Base64;

import java.io.IOException;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/chatroom")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ChatroomController {
    ChatroomService chatroomService;
    
    @PostMapping("/change-status")
    public ApiResponse<Void> setUserStatus(@RequestParam Long chatroomId, @RequestParam Long userId, @RequestParam String status) {
        ChatRoomStatus requestStatus = ChatRoomStatus.valueOf(status.toUpperCase());
        chatroomService.setUserStatus(chatroomId, userId, requestStatus);
        return ApiResponse.<Void>builder()
                        .message("Status updated successfully")
                        .build();
    }

    @GetMapping("/get/{user1Id}/{user2Id}")
    public ApiResponse<ChatroomResponse> getChatroomByUserId(@PathVariable Long user1Id, @PathVariable Long user2Id) {
        return ApiResponse.<ChatroomResponse>builder()
                .result(chatroomService.getChatroomByUserId(user1Id, user2Id))
                .build();
    }

    @GetMapping("/getAll/{userId}")
    public ApiResponse<List<ChatroomResponse>> getAllByUserId(@PathVariable Long userId) {
        return ApiResponse.<List<ChatroomResponse>>builder()
                    .result(chatroomService.getAllByUserId(userId))
                    .build();
    }
}
