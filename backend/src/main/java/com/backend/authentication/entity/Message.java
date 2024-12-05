package com.backend.authentication.entity;

import com.backend.authentication.dto.response.MessageResponse;
import com.backend.authentication.enums.ChatRoomStatus;
import com.backend.authentication.enums.MessageType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long messageId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatroom_id", referencedColumnName = "chatroomId", nullable = false)
    ChatRoom chatroom;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", referencedColumnName = "userId", nullable = false)
    User receiver;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", referencedColumnName = "userId", nullable = false)
    User sender;

    String content;

    Boolean seen;

    @Enumerated(EnumType.STRING)
    MessageType type;

    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    LocalDateTime createAt;

    public MessageResponse toMessageResponse() {
        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setMessageId(messageId);
        messageResponse.setChatroomId(chatroom.getChatroomId());
        messageResponse.setReceriverId(receiver.getUserId());
        messageResponse.setSenderId(sender.getUserId());
        messageResponse.setReceiverUsername(receiver.getUsername());
        messageResponse.setSenderUsername(sender.getUsername());
        messageResponse.setReceiverAvatar(receiver.getAvatar());
        messageResponse.setSenderAvatar(sender.getAvatar());
        messageResponse.setContent(content);
        messageResponse.setSeen(seen);
        messageResponse.setType(type);
        messageResponse.setCreateAt(createAt);

        return messageResponse;
    }
}
