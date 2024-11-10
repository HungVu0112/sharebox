package com.backend.authentication.service;

import com.backend.authentication.dto.response.VoteResponse;
import com.backend.authentication.entity.Comment;
import com.backend.authentication.entity.Post;
import com.backend.authentication.entity.User;
import com.backend.authentication.entity.VoteComment;
import com.backend.authentication.enums.VoteType;
import com.backend.authentication.exception.AppException;
import com.backend.authentication.exception.ErrorCode;
import com.backend.authentication.repository.CommentRepository;
import com.backend.authentication.repository.PostRepository;
import com.backend.authentication.repository.UserRepository;
import com.backend.authentication.repository.VoteCommentRepository;
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
public class VoteCommentService {
    VoteCommentRepository voteCommentRepository;
    CommentRepository commentRepository;
    PostRepository postRepository;
    UserRepository userRepository;

    @Transactional
    public void vote(Long postId, VoteType newVoteType, Long userId, Long commentId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        VoteComment existingVoteComment = voteCommentRepository.findByPostIdAndUserIdAndCommentId(postId, userId, commentId);

        if (existingVoteComment != null) {
            if (existingVoteComment.getVoteType() == newVoteType) {
                comment.setVoteCommentCount(comment.getVoteCommentCount() - newVoteType.getDirection());
                voteCommentRepository.delete(existingVoteComment);
            } else {
                comment.setVoteCommentCount(comment.getVoteCommentCount()
                        + newVoteType.getDirection()
                        - existingVoteComment.getVoteType().getDirection());

                existingVoteComment.setVoteType(newVoteType);
                voteCommentRepository.save(existingVoteComment);
            }
        } else {
            VoteComment voteComment = VoteComment.builder()
                    .post(post)
                    .user(user)
                    .comment(comment)
                    .voteType(newVoteType)
                    .build();

            comment.setVoteCommentCount(comment.getVoteCommentCount() + newVoteType.getDirection());
            voteCommentRepository.save(voteComment);
        }

        commentRepository.save(comment);
        postRepository.save(post);
    }


    public VoteResponse findUserVote(Long userId, Long postId, Long commentId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        VoteComment voteComment = voteCommentRepository.findByPostIdAndUserIdAndCommentId(postId, userId, commentId);

        if (voteComment == null) {
            return VoteResponse.builder().voteType(null).build();
        }

        return voteComment.toVoteResponse();

    }
}
