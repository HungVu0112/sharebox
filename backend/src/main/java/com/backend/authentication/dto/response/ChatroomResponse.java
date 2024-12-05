package com.backend.authentication.dto.response;

import com.backend.authentication.enums.ChatRoomStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatroomResponse {
    Long chatroomId;
    Long user1Id;
    Long user2Id;
    ChatRoomStatus user1Status;
    ChatRoomStatus user2Status;
    String user1_username;
    String user2_username;
    String user1_avatar;
    String user2_avatar;
}
