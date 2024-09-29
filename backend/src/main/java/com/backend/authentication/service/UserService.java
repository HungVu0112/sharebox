package com.backend.authentication.service;

import com.backend.authentication.dto.request.LoginRequest;
import com.backend.authentication.dto.request.RegisterRequest;
import com.backend.authentication.dto.request.UserAddTopicRequest;
import com.backend.authentication.dto.response.UserAccountResponse;
import com.backend.authentication.entity.Topic;
import com.backend.authentication.entity.User;
import com.backend.authentication.enums.Role;
import com.backend.authentication.exception.AppException;
import com.backend.authentication.exception.ErrorCode;
import com.backend.authentication.repository.TopicRepository;
import com.backend.authentication.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    TopicRepository topicRepository;

    public UserAccountResponse registerAccount(RegisterRequest request) throws SQLException, IOException, URISyntaxException {

        if (userRepository.existsByUserEmail(request.getUserEmail()))
            throw new AppException(ErrorCode.USER_EXISTED);

        User user = new User();

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserEmail(request.getUserEmail());

        HashSet<String> roles = new HashSet<>();
        roles.add(Role.USER.name());
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        String defaultUsername = "User" + user.getUserId();
        user.setUsername(defaultUsername);
        if(request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            byte[] avatarByte = request.getAvatar().getBytes();
            Blob avatarBlob = new SerialBlob(avatarByte);
            user.setAvatar(avatarBlob);
        }
        else {
            ClassLoader classLoader = getClass().getClassLoader();
            Path defaultImagePath = Paths.get(classLoader.getResource("static/images/uchiha.jpg").toURI());
            byte[] defaultImageBytes = Files.readAllBytes(defaultImagePath);
            Blob defaultAvatarBlob = new SerialBlob(defaultImageBytes);
            user.setAvatar(defaultAvatarBlob);
        }

        savedUser = userRepository.save(savedUser);
        return savedUser.toUserAccountResponse();

    }

    public UserAccountResponse addTopics(Long userId, UserAddTopicRequest request){

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        List<Topic> selectedTopics = topicRepository.findAllById(request.getTopicsId());
        user.setTopics(selectedTopics);
        userRepository.save(user);
        return user.toUserAccountResponse();

    }

    public User updateUser(Long userId, RegisterRequest request) throws IOException, SQLException {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setUsername(request.getUsername());
        user.setUserEmail(request.getUserEmail());
        user.setPassword(request.getPassword());
        if(!request.getAvatar().isEmpty()) {
            byte[] avatarByte = request.getAvatar().getBytes();
            Blob avatarBlob = new SerialBlob(avatarByte);
            user.setAvatar(avatarBlob);
        }
        return userRepository.save(user);
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserAccountResponse getUserById(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return user.toUserAccountResponse();
    }

    public void deleteUser(Long userId) {
         userRepository.deleteById(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        log.info("In method get Users");
        return userRepository.findAll();
    }
}
