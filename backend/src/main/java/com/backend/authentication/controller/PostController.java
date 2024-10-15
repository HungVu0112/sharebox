package com.backend.authentication.controller;

import com.backend.authentication.dto.request.CreatePostRequest;
import com.backend.authentication.dto.response.ApiResponse;
import com.backend.authentication.dto.response.CreatePostResponse;
import com.backend.authentication.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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
}
