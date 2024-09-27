package com.backend.authentication.service;

import com.backend.authentication.entity.User;
import com.backend.authentication.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    UserRepository userRepository;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        User user = userRepository.findByUserEmail(email).orElseGet(() -> {

            User newUser = User.builder()
                    .userEmail(email)
                    .username(name)
                    .build();
            newUser.setRoles(new HashSet<>());
            newUser.getRoles().add("ROLE_USER");

            return userRepository.save(newUser);
        });

        return new DefaultOAuth2User(
                Collections.singleton(() -> "ROLE_USER"),
                oauth2User.getAttributes(),
                "email" // Đây là key của email trong thông tin trả về từ Google
        );
    }
}
