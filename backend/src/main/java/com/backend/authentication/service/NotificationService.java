package com.backend.authentication.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.backend.authentication.dto.response.NotificationResponse;
import com.backend.authentication.entity.Notification;
import com.backend.authentication.repository.NotificationRepository;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {

    SimpMessagingTemplate messagingTemplate;

    NotificationRepository notificationRepository;

    public void notifyUser(Long userId, String message, String image) {
        Notification notification = new Notification(message, image);
        messagingTemplate.convertAndSend("/topic/user/" + userId, notification);
    }

    public void notifyFriendReq(Long userId, String mes) {
        messagingTemplate.convertAndSend("/topic/friendReq/" + userId, mes);
    }

    // Message
    public void notifyMessage(Long chatroomId, String mes) {
        messagingTemplate.convertAndSend("/topic/message/" + chatroomId, mes);
    }

    public void notifyUnseenMessage(Long chatroomId, Long userId, String mes) {
        messagingTemplate.convertAndSend("/topic/message/unseen/" + chatroomId + "/" + userId, mes);
    }

    public void notifyMessageUpdate(Long chatroomId, Long userId, String mes) {
        messagingTemplate.convertAndSend("/topic/message/change/" + chatroomId + "/" + userId, mes);
    }

    public void notifyMessageSeen(Long chatroomId, Long userId, String mes) {
        messagingTemplate.convertAndSend("/topic/message/seen/" + chatroomId + "/" + userId, mes);
    }

    // Online
    public void notifyOnlineUser(Long userId, String mes) {
        messagingTemplate.convertAndSend("/topic/user/online/" + userId, mes);
    }


    public List<NotificationResponse> getNotisByUserId(Long receiverId){
        List<Notification> notis = notificationRepository.getNotiByUserId(receiverId);
        return notis.stream().map(Notification::toNotificationResponse).collect(Collectors.toList());
    }

    public void deleteNotiById(Long notiId) {
        notificationRepository.deleteById(notiId);
    }

}
