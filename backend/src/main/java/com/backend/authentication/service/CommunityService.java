package com.backend.authentication.service;

import com.backend.authentication.dto.request.CommunityRequest;
import com.backend.authentication.dto.request.SearchRequest;
import com.backend.authentication.dto.response.CommunityResponse;
import com.backend.authentication.entity.Community;
import com.backend.authentication.entity.User;
import com.backend.authentication.exception.AppException;
import com.backend.authentication.exception.ErrorCode;
import com.backend.authentication.repository.CommunityRepository;
import com.backend.authentication.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommunityService {
    CommunityRepository communityRepository;
    UserRepository userRepository;

    private static final String supabaseUrl = "https://eluflzblngwpnjifvwqo.supabase.co/storage/v1/object/images/";
    private static final String supabaseApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdWZsemJsbmd3cG5qaWZ2d3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3OTY3NzMsImV4cCI6MjA0MzM3Mjc3M30.1Xj5Ndd1J6-57JQ4BtEjBTxUqmVNgOhon1BhG1PSz78";


    public CommunityResponse createCommunity(CommunityRequest request, Long userId){

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Community community = Community.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(user)
                .build();

        communityRepository.save(community);

        return community.toCommunityResponse();
    }

    public String uploadAvatar(byte[] avatarData,Long communityId, String fileName){

        String newFileName = "avatar.jpg";

        String url = supabaseUrl + "community-media/avatar/" + communityId + "/" + newFileName;
        System.out.println(url);
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.IMAGE_JPEG);
        //headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        headers.set("Authorization", "Bearer " + supabaseApiKey);
        headers.set("x-upsert", "true");

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(avatarData, headers);
        try {

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
            System.out.println("Response: " + response.getBody());
            return url;

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload avatar: " + e.getMessage());
        }
    }

    public CommunityResponse savedCommunity(Long communityId, String avatarUrl){
        Community community = communityRepository.findById(communityId).orElseThrow(() -> new AppException(ErrorCode.COMMUNITY_NOT_FOUND));
        community.setAvatar(avatarUrl);
        communityRepository.save(community);
        return community.toCommunityResponse();
    }

    public String uploadBackgroundImg(byte[] backgroundData,Long communityId, String fileName){

        String newFileName = "background.jpg";

        String url = supabaseUrl + "community-media/background/" + communityId + "/" + newFileName;
        System.out.println(url);
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.IMAGE_JPEG);
        //headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        headers.set("Authorization", "Bearer " + supabaseApiKey);
        headers.set("x-upsert", "true");

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(backgroundData, headers);
        try {

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
            System.out.println("Response: " + response.getBody());
            return url;

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload avatar: " + e.getMessage());
        }
    }

    public List<CommunityResponse> searchCommunities(SearchRequest request) {
        List<Community> communities = communityRepository.findByNameContainingIgnoreCase(request);
        return communities.stream().map(Community::toCommunityResponse).collect(Collectors.toList());
    }

    public CommunityResponse savedCommunityBackground(Long communityId, String backgroundUrl){
        Community community = communityRepository.findById(communityId).orElseThrow(() -> new AppException(ErrorCode.COMMUNITY_NOT_FOUND));
        community.setBackgroundImg(backgroundUrl);
        communityRepository.save(community);
        return community.toCommunityResponse();
    }

    public List<CommunityResponse> getAllCommunity(){
        List<Community> communities = communityRepository.findAll();
        return communities.stream().map(Community::toCommunityResponse).collect(Collectors.toList());
    }

    public void addMemberToCommunity(Long userId, Long communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMUNITY_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (community.getMembers().contains(user)) {
            throw new AppException(ErrorCode.USER_ALREADY_MEMBER_OF_COMMUNITY);
        }

        community.getMembers().add(user);
        communityRepository.save(community);

        user.getCommunities().add(community);
        userRepository.save(user);
    }

    public void leaveCommunity(Long userId, Long communityId) {
        Community community = communityRepository.findById(communityId).orElseThrow(() -> new AppException(ErrorCode.COMMUNITY_NOT_FOUND));
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if(community.getMembers().contains(user)) {
            community.getMembers().remove(user);
            communityRepository.save(community);

            user.getCommunities().remove(community);
            userRepository.save(user);
        }
    }

    public List<User> getAllMembers(Long communityId){
        Community community = communityRepository.findById(communityId).orElseThrow(() -> new AppException(ErrorCode.COMMUNITY_NOT_FOUND));
        return community.getMembers();
    }

}
