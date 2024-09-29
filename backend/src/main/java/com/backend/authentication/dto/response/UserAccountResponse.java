package com.backend.authentication.dto.response;
import com.backend.authentication.entity.Topic;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.apache.tomcat.util.codec.binary.Base64;

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

    public UserAccountResponse(Long userId, String username, String userEmail, byte[] avatarByte) {
        this.userId = userId;
        this.username = username;
        this.userEmail = userEmail;
        this.avatar = avatarByte != null ? Base64.encodeBase64String(avatarByte) : null;
    }
}
