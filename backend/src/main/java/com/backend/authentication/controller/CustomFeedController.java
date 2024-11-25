package com.backend.authentication.controller;

import com.backend.authentication.dto.request.AddCommunityRequest;
import com.backend.authentication.dto.request.CustomFeedRequest;
import com.backend.authentication.dto.request.SearchRequest;
import com.backend.authentication.dto.response.ApiResponse;
import com.backend.authentication.dto.response.CreatePostResponse;
import com.backend.authentication.dto.response.CustomFeedResponse;
import com.backend.authentication.service.CustomFeedService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/custom-feed")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomFeedController {
    CustomFeedService customFeedService;

    @PostMapping("/create/{userId}")
    public ApiResponse<CustomFeedResponse> createCustomFeed(@RequestBody CustomFeedRequest request, @PathVariable Long userId){
        return ApiResponse.<CustomFeedResponse>builder()
                .result(customFeedService.createCustomFeed(request,userId))
                .build();
    }

    // "/custom-feed/create/{userId}"

    @PostMapping("/add/{customfeedId}")
    public ApiResponse<CustomFeedResponse> addCommunity(@RequestBody AddCommunityRequest request, @PathVariable Long customfeedId){
        return ApiResponse.<CustomFeedResponse>builder()
                .result(customFeedService.addCommunity(request,customfeedId))
                .build();
    }

    // "/custom-feed/add/{customfeedId}"

    @PostMapping("/remove/{customfeedId}")
    public ApiResponse<CustomFeedResponse> removeCommunity(@RequestBody AddCommunityRequest request,@PathVariable Long customfeedId){
        return ApiResponse.<CustomFeedResponse>builder()
                .result(customFeedService.removeCommunity(customfeedId,request))
                .build();
    }

    @GetMapping("/recent-posts/{feedId}")
    public ApiResponse<List<CreatePostResponse>> getAllPostsForCustomFeeds(@PathVariable Long feedId){
        return ApiResponse.<List<CreatePostResponse>>builder()
                .result(customFeedService.getPostsForCustomFeed(feedId))
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<List<CustomFeedResponse>> getAllCustomFeeds(){
        return ApiResponse.<List<CustomFeedResponse>>builder()
                .result(customFeedService.getAllCustomFeed())
                .build();
    }

    @PostMapping("/search-posts/{feedId}")
    public ApiResponse<List<CreatePostResponse>> searchPostFromFeed(@PathVariable Long feedId, @RequestBody SearchRequest request){
        return ApiResponse.<List<CreatePostResponse>>builder()
                .result(customFeedService.searchPostsInCustomFeed(feedId, request))
                .build();
    }

    @GetMapping("/{feedId}")
    public ApiResponse<CustomFeedResponse> getFeedById(@PathVariable Long feedId){
        return ApiResponse.<CustomFeedResponse>builder()
                .result(customFeedService.getFeedById(feedId))
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<CustomFeedResponse>> getUserCustomFeeds(@PathVariable Long userId){
        return ApiResponse.<List<CustomFeedResponse>>builder()
                .result(customFeedService.getUserCustomFeeds(userId))
                .build();
    }

    // "/custom-feed/all"
}
