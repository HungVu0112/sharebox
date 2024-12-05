package com.backend.authentication.entity;

import com.backend.authentication.dto.response.ChatroomResponse;
import com.backend.authentication.enums.ChatRoomStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long chatroomId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", referencedColumnName = "userId", nullable = false)
    User user1;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", referencedColumnName = "userId", nullable = false)
    User user2;

    @Enumerated(EnumType.STRING)
    ChatRoomStatus user1Status;

    @Enumerated(EnumType.STRING)
    ChatRoomStatus user2Status;

    public ChatroomResponse toChatroomResponse() {
        ChatroomResponse chatroomResponse = new ChatroomResponse();
        chatroomResponse.setChatroomId(chatroomId);
        chatroomResponse.setUser1Id(user1.getUserId());
        chatroomResponse.setUser2Id(user2.getUserId());
        chatroomResponse.setUser1Status(user1Status);
        chatroomResponse.setUser2Status(user2Status);
        chatroomResponse.setUser1_username(user1.getUsername());
        chatroomResponse.setUser2_username(user2.getUsername());
        chatroomResponse.setUser1_avatar(user1.getAvatar());
        chatroomResponse.setUser2_avatar(user2.getAvatar());

        return chatroomResponse;
    }
}
