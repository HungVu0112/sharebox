package com.backend.authentication.entity;

import com.backend.authentication.dto.response.CommentResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", referencedColumnName = "id", nullable = false)
    Post post;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "userId", nullable = false)
    User user;

    String content;

    @ManyToOne
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL)
    @JsonIgnore
    List<Comment> childComments = new ArrayList<>();

    int voteCommentCount = 0;

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true)
    List<VoteComment> voteComments;


    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    LocalDateTime createAt;

    public CommentResponse toCommentResponse(){
        CommentResponse commentResponse = new CommentResponse();
        commentResponse.setCommentId(id);
        commentResponse.setUserId(user.getUserId());
        commentResponse.setUsername(user.getUsername());
        commentResponse.setAvatar(user.getAvatar());
        commentResponse.setPostId(post.getId());
        commentResponse.setCreateAt(createAt);
        commentResponse.setContent(content);
        commentResponse.setParentCommentId(parentComment != null ? parentComment.getId() : null);
        if (childComments != null && !childComments.isEmpty()) {
            List<CommentResponse> childCommentResponses = new ArrayList<>();
            for (Comment childComment : childComments) {
                childCommentResponses.add(childComment.toCommentResponse());
            }
            commentResponse.setChildComments(childCommentResponses);
        } else {
            commentResponse.setChildComments(new ArrayList<>());
        }
        commentResponse.setVoteCommentCount(voteCommentCount);

        return commentResponse;
    }
}
