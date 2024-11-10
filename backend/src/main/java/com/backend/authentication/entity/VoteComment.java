package com.backend.authentication.entity;

import com.backend.authentication.dto.response.VoteResponse;
import com.backend.authentication.enums.VoteType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoteComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long voteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    Post post;

    @Enumerated(EnumType.STRING)
    VoteType voteType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    Comment comment;

    public VoteResponse toVoteResponse(){
        VoteResponse voteResponse = new VoteResponse();
        voteResponse.setVoteType(voteType);

        return voteResponse;
    }
}
