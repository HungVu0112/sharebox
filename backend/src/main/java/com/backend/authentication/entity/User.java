package com.backend.authentication.entity;

import com.backend.authentication.dto.response.UserAccountResponse;
import com.backend.authentication.exception.AppException;
import com.backend.authentication.exception.ErrorCode;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long userId;

    String username;

    String userEmail;

    String password;

//    @Lob
//    @JsonIgnore
//    Blob avatar;

    String avatar;

    String status;

    Set<String> roles;

    @ManyToMany
    @JoinTable(
            name = "User_Topic",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "topic_id")
    )
    @JsonManagedReference
    List<Topic> topics;

    @ManyToMany
    @JoinTable(
            name = "community_members",
            joinColumns = @JoinColumn(name = "members_user_id"),
            inverseJoinColumns = @JoinColumn(name = "community_id"))
    @JsonBackReference
    List<Community> communities;

    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    LocalDateTime createAt;

    public UserAccountResponse toUserAccountResponse(){
        UserAccountResponse response = new UserAccountResponse();
        response.setUserId(userId);
        response.setUserEmail(userEmail);
        response.setUsername(username);
        response.setRole(roles);
        response.setUserTopics(topics);
        response.setCreateAt(createAt);
        response.setAvatar(avatar);
        response.setStatus(status);

        // Chuyển đổi Blob thành chuỗi Base64 nếu avatar không null
//        if (avatar != null) {
//            try {
//                byte[] avatarBytes = avatar.getBytes(1, (int) avatar.length());
//                String avatarBase64 = Base64.getEncoder().encodeToString(avatarBytes);
//                response.setAvatar(avatarBase64);
//            } catch (SQLException e) {
//                throw new AppException(ErrorCode.UNAUTHENTICATED);
//            }
//        } else {
//            response.setAvatar(null);
//        }

        return response;
    }
}
