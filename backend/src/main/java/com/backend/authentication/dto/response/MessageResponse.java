package com.backend.authentication.dto.response;

import com.backend.authentication.enums.ChatRoomStatus;
import com.backend.authentication.enums.MessageType;
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
public class MessageResponse {
    Long messageId;
    Long chatroomId;
    Long receriverId;
    Long senderId;
    String receiverUsername;
    String senderUsername;
    String receiverAvatar;
    String senderAvatar;
    String content;
    Boolean seen;
    MessageType type;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    LocalDateTime createAt;
}
