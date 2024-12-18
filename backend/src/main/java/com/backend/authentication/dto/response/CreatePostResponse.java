package com.backend.authentication.dto.response;

import com.backend.authentication.entity.Topic;
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
public class CreatePostResponse {
    Long postId;
    Long communityId;
    String title;
    List<Topic> postTopics;
    String content;
    List<String> media;
    Long userId;
    String userAvatar;
    String username;
    int voteCount;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    LocalDateTime createAt;
}
