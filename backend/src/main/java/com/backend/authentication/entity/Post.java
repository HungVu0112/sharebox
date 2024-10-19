package com.backend.authentication.entity;

import com.backend.authentication.dto.response.CreatePostResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String title;

    @ManyToMany
    @JoinTable(
            name = "Post_Topic",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "topic_id")
    )
    @JsonManagedReference
    List<Topic> postTopic;

    List<String> media;

    int upvotes = 0;
    int downvotes = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "userId", nullable = false)
    User user;

    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    LocalDateTime createAt;

    String content;

    public int getScore() {
        return upvotes - downvotes;
    }

    public CreatePostResponse toPostResponse(){
        CreatePostResponse createPostResponse = new CreatePostResponse();
        createPostResponse.setPostId(id);
        createPostResponse.setPostTopics(postTopic);
        createPostResponse.setContent(content);
        createPostResponse.setMedia(media);
        createPostResponse.setTitle(title);
        createPostResponse.setUpvotes(upvotes);
        createPostResponse.setDownvotes(downvotes);
        createPostResponse.setScore(getScore());
        createPostResponse.setCreateAt(createAt);

        return createPostResponse;
    }

    //Optional<Community> communityId;

}
