package com.backend.authentication.service;

import com.backend.authentication.dto.response.FriendPendingResponse;
import com.backend.authentication.dto.response.MessageResponse;
import com.backend.authentication.dto.response.UserAccountResponse;
import com.backend.authentication.entity.ChatRoom;
import com.backend.authentication.entity.FriendRequest;
import com.backend.authentication.entity.Message;
import com.backend.authentication.entity.User;
import com.backend.authentication.enums.ChatRoomStatus;
import com.backend.authentication.enums.MessageType;
import com.backend.authentication.enums.Status;
import com.backend.authentication.repository.ChatroomRepository;
import com.backend.authentication.repository.FriendRequestRepository;
import com.backend.authentication.repository.MessageRepository;
import com.backend.authentication.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageService {
    MessageRepository messageRepository;
    ChatroomRepository chatroomRepository;
    UserRepository userRepository;
    NotificationService notificationService;

    private static final String supabaseUrl = "https://eluflzblngwpnjifvwqo.supabase.co/storage/v1/object/images/";
    private static final String supabaseApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdWZsemJsbmd3cG5qaWZ2d3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3OTY3NzMsImV4cCI6MjA0MzM3Mjc3M30.1Xj5Ndd1J6-57JQ4BtEjBTxUqmVNgOhon1BhG1PSz78";

    // Private Function
    private MediaType determineMediaType(String fileName) {
        String extension = getFileExtension(fileName).toLowerCase();
        switch (extension) {
            case ".jpg":
            case ".jpeg":
                return MediaType.IMAGE_JPEG;
            case ".png":
                return MediaType.IMAGE_PNG;
            case ".gif":
                return MediaType.IMAGE_GIF;
            default:
                return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
    
    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex == -1) ? "" : fileName.substring(dotIndex);
    }

    public MessageResponse createMessage(Long senderId, Long receiverId, Long chatroomId, String content, MessageType type) {
        ChatRoom chatRoom = chatroomRepository.findById(chatroomId)
                    .orElseThrow(() -> new RuntimeException("Chatroom not found"));

        User receiver = userRepository.findById(receiverId)
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));

        User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new RuntimeException("Sender not found"));

        Boolean isSeen = false;
        if (chatRoom.getUser1().getUserId().equals(receiverId) && chatRoom.getUser1Status() == ChatRoomStatus.IN) {
            isSeen = true;
        } else if (chatRoom.getUser2().getUserId().equals(receiverId) && chatRoom.getUser2Status() == ChatRoomStatus.IN) {
            isSeen = true;
        }

        Message message = Message.builder()
                .chatroom(chatRoom)
                .receiver(receiver)
                .sender(sender)
                .seen(isSeen)
                .content(content)
                .type(type)
                .build();

        Message savedMes = messageRepository.save(message);

        String mes = savedMes.getSender().getUserId().toString();

        notificationService.notifyMessage(chatroomId, mes);
        notificationService.notifyMessageUpdate(chatroomId, receiverId, "update mes");
        notificationService.notifyUnseenMessage(chatroomId, receiverId, mes);

        return savedMes.toMessageResponse();
    }

    public String uploadMedia(byte[] mediaData, Long chatroomId, String fileName) {
        String uniqueFileName = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss-SSS"))
                + "-" + UUID.randomUUID().toString() + getFileExtension(fileName);

        String fullPath = "messages/" + chatroomId + "/" + uniqueFileName;
        String url = supabaseUrl + "/" + fullPath;
        System.out.println(url);

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(determineMediaType(fileName));
        headers.set("Authorization", "Bearer " + supabaseApiKey);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(mediaData, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
            System.out.println("Response: " + response.getBody());
            return url;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload media: " + e.getMessage());
        }
    }

    @Transactional
    public int setAllMessagesSeen(Long chatroomId, Long userId) {
        // Kiểm tra chatroom có tồn tại không
        ChatRoom chatRoom = chatroomRepository.findById(chatroomId)
                .orElseThrow(() -> new RuntimeException("Chatroom not found"));

        // Kiểm tra user có tồn tại không
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long receiverId = chatRoom.getUser1().getUserId();

        if (chatRoom.getUser1().getUserId() == userId) {
            receiverId = chatRoom.getUser2().getUserId();
        } 

        // Cập nhật tất cả các tin nhắn chưa đọc của người dùng này trong chatroom
        int updatedMessages = messageRepository.updateUnseenMessagesByChatroomAndReceiver(chatroomId, userId);

        // Nếu có tin nhắn được cập nhật, thông báo
        if (updatedMessages > 0) {
            notificationService.notifyMessageUpdate(chatroomId, receiverId, "update messages");
            notificationService.notifyMessageSeen(chatroomId, userId, "message seen");
        }
        
        return updatedMessages;
    }

    public void deleteMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        Long receiverId = message.getReceiver().getUserId();
        Long chatroomId = message.getChatroom().getChatroomId();
        notificationService.notifyMessageUpdate(chatroomId, receiverId, "update mes");

        messageRepository.delete(message);
    }

    public void editMessage(Long messageId, String newContent) {
        Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setContent(newContent);

        Long receiverId = message.getReceiver().getUserId();
        Long chatroomId = message.getChatroom().getChatroomId();
        notificationService.notifyMessageUpdate(chatroomId, receiverId, "update mes");
        
        messageRepository.save(message);
    }

    public List<MessageResponse> getListMessage(Long chatroomId) {
        ChatRoom chatRoom = chatroomRepository.findById(chatroomId)
                    .orElseThrow(() -> new RuntimeException("Chatroom not found"));

        List<Message> messages = messageRepository.findByChatroomId(chatroomId);

        return messages.stream()
                .map(Message::toMessageResponse)
                .collect(Collectors.toList());
    }

    public MessageResponse getLatestMessageByChatroomId(Long chatroomId) {
        ChatRoom chatRoom = chatroomRepository.findById(chatroomId)
                    .orElseThrow(() -> new RuntimeException("Chatroom not found"));

        Pageable pageable = PageRequest.of(0, 1, Sort.by("createAt").descending());
        Page<Message> latestMessagePage = messageRepository.findLatestMessageByChatroomId(chatroomId, pageable);

        if (latestMessagePage.hasContent()) {
            return latestMessagePage.getContent().get(0).toMessageResponse();
        }

        return null;
    }
}
