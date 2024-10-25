package com.backend.authentication.service;

import com.backend.authentication.dto.response.VoteResponse;
import com.backend.authentication.entity.Post;
import com.backend.authentication.entity.User;
import com.backend.authentication.entity.Vote;
import com.backend.authentication.enums.VoteType;
import com.backend.authentication.exception.AppException;
import com.backend.authentication.exception.ErrorCode;
import com.backend.authentication.repository.PostRepository;
import com.backend.authentication.repository.UserRepository;
import com.backend.authentication.repository.VoteRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoteService {

    VoteRepository voteRepository;
    PostRepository postRepository;
    UserRepository userRepository;

    @Transactional
    public void vote(Long postId, VoteType newVoteType, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Vote existingVote = voteRepository.findByPostIdAndUserId(postId, userId);

        if (existingVote != null) {
            if (existingVote.getVoteType() == newVoteType) {
                post.setVoteCount(post.getVoteCount() - newVoteType.getDirection());
                voteRepository.delete(existingVote);
            } else {
                post.setVoteCount(post.getVoteCount()
                        + newVoteType.getDirection()
                        - existingVote.getVoteType().getDirection());

                existingVote.setVoteType(newVoteType);
                voteRepository.save(existingVote);
            }
        } else {
            Vote vote = Vote.builder()
                    .post(post)
                    .user(user)
                    .voteType(newVoteType)
                    .build();

            post.setVoteCount(post.getVoteCount() + newVoteType.getDirection());
            voteRepository.save(vote);
        }

        postRepository.save(post);
    }

    public VoteResponse findUserVote(Long userId, Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Vote vote = voteRepository.findByPostIdAndUserId(postId, userId);

        if (vote == null) {
            return VoteResponse.builder().voteType(null).build();
        }

        return vote.toVoteResponse();

    }
}
