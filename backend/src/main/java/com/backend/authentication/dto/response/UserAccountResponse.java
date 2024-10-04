package com.backend.authentication.dto.response;
import com.backend.authentication.entity.Topic;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.apache.tomcat.util.codec.binary.Base64;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAccountResponse {
    Long userId;
    String username;
    String userEmail;
    String avatar;
    Set<String> role;
    List<Topic> userTopics;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    LocalDateTime createAt;

//    public UserAccountResponse(Long userId, String username, String userEmail, byte[] avatarByte) {
//        this.userId = userId;
//        this.username = username;
//        this.userEmail = userEmail;
//        this.avatar = avatarByte != null ? Base64.encodeBase64String(avatarByte) : null;
//    }
}
