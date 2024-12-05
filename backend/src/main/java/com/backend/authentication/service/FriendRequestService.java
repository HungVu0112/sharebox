package com.backend.authentication.service;

import com.backend.authentication.dto.response.FriendPendingResponse;
import com.backend.authentication.dto.response.UserAccountResponse;
import com.backend.authentication.entity.ChatRoom;
import com.backend.authentication.entity.FriendRequest;
import com.backend.authentication.entity.User;
import com.backend.authentication.enums.ChatRoomStatus;
import com.backend.authentication.enums.Status;
import com.backend.authentication.repository.ChatroomRepository;
import com.backend.authentication.repository.FriendRequestRepository;
import com.backend.authentication.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendRequestService {

    FriendRequestRepository friendRequestRepository;

    UserRepository userRepository;

    NotificationService notificationService;

    ChatroomRepository chatroomRepository;

    public FriendRequest sendFriendRequest(Long requesterId, Long receiverId) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (friendRequestRepository.findByRequesterAndStatus(requester, Status.PENDING)
                .stream()
                .anyMatch(request -> request.getReceiver().equals(receiver))) {
            throw new RuntimeException("Friend request already sent");
        }

        FriendRequest friendRequest = FriendRequest.builder()
                .requester(requester)
                .receiver(receiver)
                .status(Status.PENDING)
                .build();

        notificationService.notifyUser(receiver.getUserId(),
                "You have a new friend request from " + requester.getUsername(), requester.getAvatar());

        return friendRequestRepository.save(friendRequest);
    }

    public void respondToRequest(Long requesterId, Long receiverId, Status status) {
        FriendRequest friendRequest = friendRequestRepository.findByRequesterUserIdAndReceiverUserId(requesterId, receiverId)
                .orElseThrow(() -> new RuntimeException("Friend Request not found"));

        if (!friendRequest.getReceiver().getUserId().equals(receiverId)) {
            throw new RuntimeException("Only the receiver can respond to the friend request");
        }

        String message = status == Status.ACCEPTED
                ? "Your friend request to " + friendRequest.getReceiver().getUsername() + " was accepted!"
                : "Your friend request to " + friendRequest.getReceiver().getUsername() + " was rejected!";

        notificationService.notifyUser(friendRequest.getRequester().getUserId(), message, friendRequest.getReceiver().getAvatar());
        notificationService.notifyFriendReq(friendRequest.getRequester().getUserId(), status.toString());
        
        if (status == Status.REJECTED) {
            friendRequestRepository.delete(friendRequest);
        } else {
            ChatRoom chatroom = ChatRoom.builder()
                        .user1(friendRequest.getReceiver())
                        .user2(friendRequest.getRequester())
                        .user1Status(ChatRoomStatus.LEAVE)
                        .user2Status(ChatRoomStatus.LEAVE)
                        .build();
            chatroomRepository.save(chatroom);
            friendRequest.setStatus(status);    
            friendRequestRepository.save(friendRequest);
        }

    }

    public List<UserAccountResponse> getPendingRequests(Long receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        List<User> users = friendRequestRepository.findPendingReqsByUserId(receiverId);
        return users.stream().map(User::toUserAccountResponse).collect(Collectors.toList());
    }

    public void cancelFriendRequest(Long requesterId, Long receiverId) {
        FriendRequest friendRequest = friendRequestRepository.findByRequesterUserIdAndReceiverUserId(requesterId, receiverId)
            .orElseThrow(() -> new RuntimeException("Friend Request not found"));
    
        // Kiểm tra xem request có đang ở trạng thái PENDING không
        if (friendRequest.getStatus() != Status.PENDING) {
            throw new RuntimeException("Only pending friend requests can be cancelled");
        }
    
        // Kiểm tra xem người hủy có phải là người gửi request không
        if (!friendRequest.getRequester().getUserId().equals(requesterId)) {
            throw new RuntimeException("Only the requester can cancel the friend request");
        }
    
        // Xóa request khỏi database
        friendRequestRepository.delete(friendRequest);
    
        // Thông báo cho người nhận
        notificationService.notifyUser(
            friendRequest.getReceiver().getUserId(), 
            friendRequest.getRequester().getUsername() + " has cancelled their friend request.",
            friendRequest.getRequester().getAvatar()
        );
    }

    public List<UserAccountResponse> getFriends(Long userId) {
        List<User> users = friendRequestRepository.findFriendsByUserId(userId);
        return users.stream().map(User::toUserAccountResponse).collect(Collectors.toList());
    }

    public List<UserAccountResponse> getOnlineFriends(Long userId) {
        List<User> friends = friendRequestRepository.findFriendsByUserId(userId);
        return friends.stream()
                .filter(User::getOnline)
                .map(User::toUserAccountResponse)
                .collect(Collectors.toList());
    }

    @Async
    public void notifyFriendsAboutOnlineStatus(User user) {
        if (user == null) {
            log.error("Cannot notify friends: User is null");
            return;
        }

        try {
            List<User> onlineFriends = Optional
                    .ofNullable(friendRequestRepository.findFriendsByUserId(user.getUserId()))
                    .orElseGet(Collections::emptyList) // Default to empty list if null
                    .stream()
                    .filter(Objects::nonNull) // Filter out any null friends
                    .filter(User::getOnline)
                    .collect(Collectors.toList());

            onlineFriends.forEach(friend -> {
                try {
                    if (friend != null) {
                        notificationService.notifyOnlineUser(
                                friend.getUserId(),
                                user.getUsername() + " is now online");
                    }
                } catch (Exception e) {
                    log.error("Failed to notify friend {} about user {} online status",
                            friend != null ? friend.getUserId() : "unknown",
                            user.getUserId(),
                            e);
                }
            });
        } catch (Exception e) {
            log.error("Error in notifyFriendsAboutOnlineStatus for user {}", user.getUserId(), e);
        }
    }
}
