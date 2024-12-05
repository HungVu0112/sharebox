package com.backend.authentication.dto.request;

import com.backend.authentication.enums.MessageType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageRequest {
    String content;
    MessageType type;
}
