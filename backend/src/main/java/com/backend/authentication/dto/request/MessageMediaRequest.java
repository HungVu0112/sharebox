package com.backend.authentication.dto.request;

import org.springframework.web.multipart.MultipartFile;

import com.backend.authentication.enums.MessageType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageMediaRequest {
    MultipartFile content;
    MessageType type;
}
