package com.backend.authentication.controller;

import com.backend.authentication.dto.request.AvatarRequest;
import com.backend.authentication.dto.request.BackgroundImgRequest;
import com.backend.authentication.dto.request.CommunityRequest;
import com.backend.authentication.dto.request.SearchRequest;
import com.backend.authentication.dto.response.ApiResponse;
import com.backend.authentication.dto.response.CommunityResponse;
import com.backend.authentication.entity.User;
import com.backend.authentication.service.CommunityService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/community")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommunityController {
    CommunityService communityService;

    @PostMapping("/create/{userId}")
    public ApiResponse<CommunityResponse> createCommunity(@RequestBody CommunityRequest request, @PathVariable Long userId){
        return ApiResponse.<CommunityResponse>builder()
                .result(communityService.createCommunity(request, userId))
                .build();
    }

    @PostMapping("/{communityId}/upload-avatar")
    public ResponseEntity<String> uploadAvatar(@PathVariable Long communityId, @ModelAttribute AvatarRequest request){
        try {
            byte[] avatarData = request.getAvatar().getBytes();
            String avatarUrl = communityService.uploadAvatar(avatarData,communityId,request.getAvatar().getOriginalFilename());

            communityService.savedCommunity(communityId,avatarUrl);

            return ResponseEntity.ok("Community registered successfully with avatar URL: " + avatarUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{communityId}/upload-background")
    public ResponseEntity<String> uploadBackground(@PathVariable Long communityId, @ModelAttribute BackgroundImgRequest request){
        try {
            byte[] backgroundData = request.getBackgroundImg().getBytes();
            String backgroundUrl = communityService.uploadBackgroundImg(backgroundData,communityId,request.getBackgroundImg().getOriginalFilename());

            communityService.savedCommunityBackground(communityId,backgroundUrl);

            return ResponseEntity.ok("Community registered successfully with background URL: " + backgroundUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/search")
    public ApiResponse<List<CommunityResponse>> searchCommunities(@RequestBody SearchRequest request){
        return ApiResponse.<List<CommunityResponse>>builder()
                .result(communityService.searchCommunities(request))
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<List<CommunityResponse>> getAllCommunity(){
        return ApiResponse.<List<CommunityResponse>>builder()
                .result(communityService.getAllCommunity())
                .build();
    }

    @PostMapping("/add/{userId}/{communityId}")
    public void joinCommunity(@PathVariable Long userId,@PathVariable Long communityId){
        communityService.addMemberToCommunity(userId,communityId);
    }

    @PostMapping("/leave/{userId}/{communityId}")
    public void leaveCommunity(@PathVariable Long userId,@PathVariable Long communityId){
        communityService.leaveCommunity(userId,communityId);
    }

    @GetMapping("/members/{communityId}")
    public ApiResponse<List<User>> getAllMembers(@PathVariable Long communityId){
        return ApiResponse.<List<User>>builder()
                .result(communityService.getAllMembers(communityId))
                .build();

    }

}
