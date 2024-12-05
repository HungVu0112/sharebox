package com.backend.authentication.controller;

import com.backend.authentication.dto.request.MessageMediaRequest;
import com.backend.authentication.dto.request.MessageRequest;
import com.backend.authentication.dto.response.ApiResponse;
import com.backend.authentication.dto.response.MessageResponse;
import com.backend.authentication.service.MessageService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/message")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageController {
    MessageService messageService;

    @PostMapping("/create/{chatroomId}/{senderId}/{receiverId}")
    public ApiResponse<MessageResponse> createMessage(@PathVariable Long senderId, @PathVariable Long receiverId, @PathVariable Long chatroomId, @ModelAttribute MessageRequest request) {
        return ApiResponse.<MessageResponse>builder()
                .result(messageService.createMessage(senderId, receiverId, chatroomId, request.getContent(), request.getType()))
                .build();
    }

    @PostMapping("/create-media/{chatroomId}/{senderId}/{receiverId}")
    public ApiResponse<MessageResponse> createMediaMessage(@PathVariable Long senderId, @PathVariable Long receiverId, @PathVariable Long chatroomId, @ModelAttribute MessageMediaRequest request) {
        try {
            byte[] mediaData = request.getContent().getBytes();
            String mediaUrl = messageService.uploadMedia(mediaData, chatroomId, request.getContent().getOriginalFilename());

            return ApiResponse.<MessageResponse>builder()
                    .result(messageService.createMessage(senderId, receiverId, chatroomId, mediaUrl, request.getType()))
                    .build();
        } catch (IOException e) {
            return ApiResponse.<MessageResponse>builder()
                    .code(400)
                    .message(e.getMessage())
                    .build();
        }
    }

    @PostMapping("/setSeen/{chatroomId}/{userId}")
    public ApiResponse<Integer> setAllMessagesSeen(@PathVariable Long chatroomId, @PathVariable Long userId) {
        return ApiResponse.<Integer>builder()
                .result(messageService.setAllMessagesSeen(chatroomId, userId))
                .build();
    }

    @PostMapping("/delete/{messageId}")
    public ApiResponse<Void> deleteMessage(@PathVariable Long messageId) {
        messageService.deleteMessage(messageId);
        return ApiResponse.<Void>builder()
                .message("Delete successfilly!")
                .build();
    }

    @PostMapping("/edit/{messageId}")
    public ApiResponse<Void> editMessage(@PathVariable Long messageId, @ModelAttribute MessageRequest request) {
        messageService.editMessage(messageId, request.getContent());
        return ApiResponse.<Void>builder()
                .message("Updated successfilly!")
                .build();
    }

    @GetMapping("/get/{chatroomId}")
    public ApiResponse<List<MessageResponse>> getListMessage(@PathVariable Long chatroomId) {
        return ApiResponse.<List<MessageResponse>>builder()
                    .result(messageService.getListMessage(chatroomId))
                    .build();
    }
    
    @GetMapping("/getlatest/{chatroomId}")
    public ApiResponse<MessageResponse> getLatestMessageByChatroomId(@PathVariable Long chatroomId) {
        return ApiResponse.<MessageResponse>builder()
                    .result(messageService.getLatestMessageByChatroomId(chatroomId))
                    .build();
    }
}
