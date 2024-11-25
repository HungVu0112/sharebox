package com.backend.authentication.controller;

import com.backend.authentication.dto.response.ApiResponse;
import com.backend.authentication.dto.response.FriendPendingResponse;
import com.backend.authentication.dto.response.UserAccountResponse;
import com.backend.authentication.entity.FriendRequest;
import com.backend.authentication.enums.Status;
import com.backend.authentication.service.FriendRequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friend")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendRequestController {

    FriendRequestService friendRequestService;

    @PostMapping("/request")
    public ResponseEntity<FriendRequest> sendRequest(
            @RequestParam Long requesterId, @RequestParam Long receiverId) {
        FriendRequest friendRequest = friendRequestService.sendFriendRequest(requesterId, receiverId);
        return ResponseEntity.ok(friendRequest);
    }

    @PostMapping("/response")
    public ResponseEntity<FriendRequest> respondToRequest(
            @RequestParam Long requesterId, @RequestParam Long receiverId, @RequestParam String status) {
        Status requestStatus = Status.valueOf(status.toUpperCase());
        FriendRequest updatedRequest = friendRequestService.respondToRequest(requesterId, receiverId, requestStatus);
        return ResponseEntity.ok(updatedRequest);
    }

    @GetMapping("/pending")
    public ApiResponse<List<FriendPendingResponse>> getPendingRequests(@RequestParam Long receiverId) {
        return ApiResponse.<List<FriendPendingResponse>>builder()
                .result(friendRequestService.getPendingRequests(receiverId))
                .build();
    }

    @GetMapping("/list")
    public ApiResponse<List<UserAccountResponse>> getFriends(@RequestParam Long userId) {
        return ApiResponse.<List<UserAccountResponse>>builder()
                .result(friendRequestService.getFriends(userId))
                .build();
    }

}
