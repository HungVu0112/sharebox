package com.backend.authentication.service;

import com.backend.authentication.dto.response.ChatroomResponse;
import com.backend.authentication.entity.ChatRoom;
import com.backend.authentication.entity.User;
import com.backend.authentication.enums.ChatRoomStatus;
import com.backend.authentication.repository.ChatroomRepository;
import com.backend.authentication.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatroomService {
    ChatroomRepository chatroomRepository;
    UserRepository userRepository;

    public void setUserStatus(Long chatroomId, Long userId, ChatRoomStatus status) {
        ChatRoom chatRoom = chatroomRepository.findById(chatroomId)
                    .orElseThrow(() -> new RuntimeException("Chatroom notfound"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (chatRoom.getUser1().getUserId().equals(userId)) {
            chatRoom.setUser1Status(status);
        } else if (chatRoom.getUser2().getUserId().equals(userId)) {
            chatRoom.setUser2Status(status);
        } else {
            throw new RuntimeException("User is not a member of this chat !");
        }

        chatroomRepository.save(chatRoom);
    }

    public ChatroomResponse getChatroomByUserId(Long user1Id, Long user2Id) {
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new RuntimeException("User1 not found"));

        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("User2 not found"));

        ChatRoom chatRoom = chatroomRepository.findByUser1AndUser2OrUser2AndUser1(user1, user2)
                .orElse(null);
        
        return chatRoom.toChatroomResponse();
    }

    public List<ChatroomResponse> getAllByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ChatRoom> chatrooms = chatroomRepository.findAllChatroomsByUserId(userId);

        return chatrooms.stream()
                .map(ChatRoom::toChatroomResponse)
                .collect(Collectors.toList());
    }
}
