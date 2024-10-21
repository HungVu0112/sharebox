package com.backend.authentication.controller;

import com.backend.authentication.dto.request.CreatePostRequest;
import com.backend.authentication.dto.response.ApiResponse;
import com.backend.authentication.dto.response.CreatePostResponse;
import com.backend.authentication.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {

    PostService postService;

    @PostMapping("/create-post/{userId}")
    public ApiResponse<CreatePostResponse> createPost(@ModelAttribute CreatePostRequest request, @PathVariable Long userId) throws IOException {
        return ApiResponse.<CreatePostResponse>builder()
                .result(postService.createPost(request, userId))
                .build();
    }

    @GetMapping("/get-post/{userId}")
    public ApiResponse<List<CreatePostResponse>> getAllPostByUserId(@PathVariable Long userId){
        return ApiResponse.<List<CreatePostResponse>>builder()
                .result(postService.getAllPostByUserId(userId))
                .build();
    }

    @GetMapping("/{topicId}")
    public ApiResponse<List<CreatePostResponse>> getPostByTopic(@PathVariable Long topicId){
        return ApiResponse.<List<CreatePostResponse>>builder()
                .result(postService.getPostByTopic(topicId))
                .build();
    }

    @GetMapping("/posts")
    public ApiResponse<List<CreatePostResponse>> getPostByTopics(@RequestBody List<Long> topicsId){
        return ApiResponse.<List<CreatePostResponse>>builder()
                .result(postService.getPostByTopics(topicsId))
                .build();
    }

    @GetMapping("/get/{postId}")
    public ApiResponse<CreatePostResponse> getPostById(@PathVariable Long postId){
        return ApiResponse.<CreatePostResponse>builder()
                .result(postService.getPostById(postId))
                .build();
    }

    @GetMapping("/recommend-posts/{userId}")
    public ApiResponse<List<CreatePostResponse>> getRecommendPosts(@PathVariable Long userId){
        return ApiResponse.<List<CreatePostResponse>>builder()
                .result(postService.getPostByUserTopics(userId))
                .build();
    }

    @PostMapping("/{postId}/upvote")
    public ResponseEntity<Void> upvotePost(@PathVariable Long postId) {
        postService.upvotePost(postId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/downvote")
    public ResponseEntity<Void> downvotePost(@PathVariable Long postId) {
        postService.downvotePost(postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}/score")
    public ResponseEntity<Integer> getPostScore(@PathVariable Long postId) {
        int score = postService.getScore(postId);
        return ResponseEntity.ok(score);
    }

}
