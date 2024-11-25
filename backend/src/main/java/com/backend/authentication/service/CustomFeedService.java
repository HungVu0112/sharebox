package com.backend.authentication.service;

import com.backend.authentication.dto.request.AddCommunityRequest;
import com.backend.authentication.dto.request.CustomFeedRequest;
import com.backend.authentication.dto.request.SearchRequest;
import com.backend.authentication.dto.response.CreatePostResponse;
import com.backend.authentication.dto.response.CustomFeedResponse;
import com.backend.authentication.entity.Community;
import com.backend.authentication.entity.CustomFeed;
import com.backend.authentication.entity.Post;
import com.backend.authentication.entity.User;
import com.backend.authentication.exception.AppException;
import com.backend.authentication.exception.ErrorCode;
import com.backend.authentication.repository.CommunityRepository;
import com.backend.authentication.repository.CustomFeedRepository;
import com.backend.authentication.repository.PostRepository;
import com.backend.authentication.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomFeedService {
    UserRepository userRepository;
    CustomFeedRepository customFeedRepository;
    CommunityRepository communityRepository;
    PostRepository postRepository;

    public CustomFeedResponse createCustomFeed(CustomFeedRequest request, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        CustomFeed customFeed = CustomFeed.builder()
                .owner(user)
                .name(request.getName())
                .description(request.getDescription())
                .build();

        customFeedRepository.save(customFeed);
        return customFeed.toCustomFeedResponse();
    }

    public CustomFeedResponse addCommunity(AddCommunityRequest request, Long customfeedId) {
        CustomFeed customFeed = customFeedRepository.findById(customfeedId).orElseThrow(() -> new AppException(ErrorCode.CUSTOMFEED_NOT_FOUND));

        List<Community> communities = communityRepository.findAllById(request.getCommunityIds());

        if (communities.size() != request.getCommunityIds().size()) {

            throw new AppException(ErrorCode.COMMUNITY_NOT_FOUND);
        }

        for (Community community : communities) {
            if (customFeed.getCommunities().contains(community)) {
                throw new AppException(ErrorCode.COMMUNITY_ALREADY_EXISTS_IN_FEED);
            }
        }

        customFeed.getCommunities().addAll(communities);
        customFeedRepository.save(customFeed);
        return customFeed.toCustomFeedResponse();
    }

    public CustomFeedResponse removeCommunity(Long feedId, AddCommunityRequest request) {
        CustomFeed customFeed = customFeedRepository.findById(feedId)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMFEED_NOT_FOUND));
        List<Community> communities = communityRepository.findAllById(request.getCommunityIds());

        if (communities.size() != request.getCommunityIds().size()) {

            throw new AppException(ErrorCode.COMMUNITY_NOT_FOUND);
        }

        customFeed.getCommunities().removeAll(communities);
        customFeedRepository.save(customFeed);

        return customFeed.toCustomFeedResponse();
    }

    public List<CreatePostResponse> getPostsForCustomFeed(Long feedId) {
        CustomFeed customFeed = customFeedRepository.findById(feedId)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMFEED_NOT_FOUND));

        List<Post> posts = new ArrayList<>();
        for (Community community : customFeed.getCommunities()) {
            posts.addAll(postRepository.getPostByCommunity(community.getId()));
        }
        posts.sort(Comparator.comparing(Post::getCreateAt).reversed());
        return posts.stream().map(Post::toPostResponse).collect(Collectors.toList());
    }

    public List<CustomFeedResponse> getAllCustomFeed() {
        List<CustomFeed> customFeeds = customFeedRepository.findAll();
        return customFeeds.stream().map(CustomFeed::toCustomFeedResponse).collect(Collectors.toList());
    }

    public List<CustomFeedResponse> getUserCustomFeeds(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<CustomFeed> customFeeds = customFeedRepository.findByOwner(user);

        return customFeeds.stream().map(CustomFeed::toCustomFeedResponse).collect(Collectors.toList());
    }

    public List<CreatePostResponse> searchPostsInCustomFeed(Long feedId, SearchRequest request) {
        CustomFeed customFeed = customFeedRepository.findById(feedId)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMFEED_NOT_FOUND));

        List<Post> posts = new ArrayList<>();
        for (Community community : customFeed.getCommunities()) {
            posts.addAll(postRepository.findByCommunityAndKeyword(community.getId(), request));
        }
        return posts.stream().map(Post::toPostResponse).collect(Collectors.toList());
    }

    public CustomFeedResponse getFeedById(Long feedId) {
        CustomFeed customFeed = customFeedRepository.findById(feedId).orElseThrow(() -> new AppException(ErrorCode.CUSTOMFEED_NOT_FOUND));

        return customFeed.toCustomFeedResponse();
    }
}
