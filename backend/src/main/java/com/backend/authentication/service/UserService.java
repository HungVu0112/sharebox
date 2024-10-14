package com.backend.authentication.service;

import com.backend.authentication.dto.request.*;
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
import org.springframework.http.*;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    TopicRepository topicRepository;

    private static final String supabaseUrl = "https://eluflzblngwpnjifvwqo.supabase.co/storage/v1/object/images/";
    private static final String supabaseApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdWZsemJsbmd3cG5qaWZ2d3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3OTY3NzMsImV4cCI6MjA0MzM3Mjc3M30.1Xj5Ndd1J6-57JQ4BtEjBTxUqmVNgOhon1BhG1PSz78";

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
        if(request.getAvatar() == null || request.getAvatar().isEmpty()){
            user.setAvatar("https://eluflzblngwpnjifvwqo.supabase.co/storage/v1/object/public/images/avatars/uchiha.jpg");
        }
//        if(request.getAvatar() != null && !request.getAvatar().isEmpty()) {
//            byte[] avatarByte = request.getAvatar().getBytes();
//            Blob avatarBlob = new SerialBlob(avatarByte);
//            user.setAvatar(avatarBlob);
//        }
//        else {
//            ClassLoader classLoader = getClass().getClassLoader();
//            Path defaultImagePath = Paths.get(classLoader.getResource("static/images/uchiha.jpg").toURI());
//            byte[] defaultImageBytes = Files.readAllBytes(defaultImagePath);
//            Blob defaultAvatarBlob = new SerialBlob(defaultImageBytes);
//            user.setAvatar(defaultAvatarBlob);
//        }

        savedUser = userRepository.save(savedUser);
        return savedUser.toUserAccountResponse();

    }

    public String uploadAvatar(byte[] avatarData,Long userId, String fileName){

//        String extension = fileName.substring(fileName.lastIndexOf("."));
//        String newFileName = UUID.randomUUID().toString() + extension;

        String newFileName = "avatar.jpg";

        String url = supabaseUrl + "avatars/" + userId + "/" + newFileName;
        System.out.println(url);
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.IMAGE_JPEG);
        //headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        headers.set("Authorization", "Bearer " + supabaseApiKey);
        headers.set("x-upsert", "true");

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(avatarData, headers);
        try {
            //restTemplate.exchange(url, HttpMethod.PUT, requestEntity, String.class);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
            System.out.println("Response: " + response.getBody());
            return url; // Trả về URL của avatar đã tải lên

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload avatar: " + e.getMessage());
        }
    }

    public UserAccountResponse savedUser(Long userId, String avatarUrl){
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setAvatar(avatarUrl);
        userRepository.save(user);
        return user.toUserAccountResponse();
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
//        user.setPassword(request.getPassword());
//        if(!request.getAvatar().isEmpty()) {
//            byte[] avatarByte = request.getAvatar().getBytes();
//            Blob avatarBlob = new SerialBlob(avatarByte);
//            user.setAvatar(avatarBlob);
//        }
        return userRepository.save(user);
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserAccountResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND));
        return user.toUserAccountResponse();
    }

    public UserAccountResponse getUserById(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return user.toUserAccountResponse();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long userId) {
         userRepository.deleteById(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        log.info("In method get Users");
        return userRepository.findAll();
    }

    public UserAccountResponse uploadInfo(Long userId, InfoUpdateRequest request) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setUsername(request.getUsername());

        String fileName = StringUtils.cleanPath(request.getAvatar().getOriginalFilename());
        String uploadDir = "user-avatars/" + userId;
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Lưu file vào hệ thống
        try (InputStream inputStream = request.getAvatar().getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("File saved to: " + filePath.toString());

            // Cập nhật đường dẫn avatar vào cơ sở dữ liệu
            user.setAvatar("/authentication/" + uploadDir + "/" + fileName);
            userRepository.save(user);

            return user.toUserAccountResponse();
        } catch (IOException e) {
            throw new IOException("Could not save avatar: " + fileName, e);
        }
    }

    public UserAccountResponse loginWithGoogle(GoogleLoginRequest request) {
        Optional<User> existingUser = userRepository.findByUserEmail(request.getEmail());

        if(existingUser.isPresent() && existingUser.get().getPassword() == null ){
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = existingUser
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .username(request.getUsername())
                            .userEmail(request.getEmail())
                            .avatar(request.getAvatar())
                            .status("new")
                            .build();

                    newUser.setRoles(new HashSet<>());
                    newUser.getRoles().add(Role.USER.name());

                    return userRepository.save(newUser);
                });
        return user.toUserAccountResponse();
    }
}
