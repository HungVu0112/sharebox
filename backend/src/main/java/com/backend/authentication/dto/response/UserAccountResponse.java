package com.backend.authentication.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.apache.tomcat.util.codec.binary.Base64;

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

    public UserAccountResponse(Long userId, String username, String userEmail, byte[] avatarByte) {
        this.userId = userId;
        this.username = username;
        this.userEmail = userEmail;
        this.avatar = avatarByte != null ? Base64.encodeBase64String(avatarByte) : null;
    }
}
