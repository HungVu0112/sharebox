package com.backend.authentication.controller;

import com.backend.authentication.dto.request.CommentRequest;
import com.backend.authentication.dto.response.ApiResponse;
import com.backend.authentication.dto.response.CommentResponse;
import com.backend.authentication.service.CommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {
    CommentService commentService;

    @PostMapping("/create/{userId}/{postId}")
    public ApiResponse<CommentResponse> createComment(@PathVariable Long userId, @PathVariable Long postId, @RequestBody CommentRequest request){
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.createComment(request,userId,postId))
                .build();
    }

    @GetMapping("/count/{postId}")
    public ApiResponse<Long> totalCommentInPost(@PathVariable Long postId){
        return ApiResponse.<Long>builder()
                .result(commentService.getTotalComments(postId))
                .build();
    }

    @GetMapping("/{postId}")
    public ApiResponse<List<CommentResponse>> getCommentByPost(@PathVariable Long postId){
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getCommentsByPost(postId))
                .build();
    }

    @GetMapping("/parent/{postId}")
    public ApiResponse<List<CommentResponse>> getAllParentComments(@PathVariable Long postId){
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getAllParentComment(postId))
                .build();
    }

    @GetMapping("/child/{postId}/{parentCommentId}")
    public ApiResponse<List<CommentResponse>> getAllChildComment(@PathVariable Long postId, @PathVariable Long parentCommentId){
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getChildComments(postId, parentCommentId))
                .build();
    }
}
