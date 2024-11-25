package com.backend.authentication.service;

import com.backend.authentication.dto.response.CreatePostResponse;
import com.backend.authentication.entity.Favorite;
import com.backend.authentication.entity.Post;
import com.backend.authentication.entity.User;
import com.backend.authentication.exception.AppException;
import com.backend.authentication.exception.ErrorCode;
import com.backend.authentication.repository.FavoriteRepository;
import com.backend.authentication.repository.PostRepository;
import com.backend.authentication.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class FavoriteService {

    PostRepository postRepository;
    FavoriteRepository favoriteRepository;
    UserRepository userRepository;

    public void savePost(Long userId, Long postId) {
        if (favoriteRepository.findByUserIdAndPostId(userId, postId).isPresent()) {
            throw new IllegalArgumentException("Post is already saved!");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        Favorite savedPost = Favorite.builder()
                .user(user)
                .post(post)
                .build();

        favoriteRepository.save(savedPost);
    }

    public void unsavePost(Long userId, Long postId) {
        Favorite savedPost = favoriteRepository.findByUserIdAndPostId(userId, postId)
                .orElseThrow(() -> new IllegalArgumentException("Saved post not found"));

        favoriteRepository.delete(savedPost);
    }

    public List<CreatePostResponse> getUserSavedPosts(Long userId) {
        List<Post> posts = favoriteRepository.findByUserId(userId);

        return posts.stream().map(Post::toPostResponse).collect(Collectors.toList());
    }
}

