package com.backend.authentication.controller;

import com.backend.authentication.dto.request.*;
import com.backend.authentication.dto.response.ApiResponse;
import com.backend.authentication.dto.response.UserAccountResponse;
import com.backend.authentication.entity.User;
import com.backend.authentication.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.apache.tomcat.util.codec.binary.Base64;

import java.io.IOException;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {

    UserService userService;

    @PostMapping("/register")
    public ApiResponse<UserAccountResponse> registerAccount(@ModelAttribute RegisterRequest request) throws SQLException, IOException, URISyntaxException {
        return ApiResponse.<UserAccountResponse>builder()
                .result(userService.registerAccount(request))
                .build();
    }

    @PostMapping("/{userId}/select-topics")
    public ApiResponse<UserAccountResponse> addTopics(@PathVariable Long userId, @RequestBody UserAddTopicRequest request){
        return ApiResponse.<UserAccountResponse>builder()
                .result(userService.addTopics(userId,request))
                .build();
    }

    @PostMapping("/{userId}/upload-avatar")
    public ResponseEntity<String> uploadAvatar(@PathVariable Long userId, @ModelAttribute AvatarRequest request){
        try {
            byte[] avatarData = request.getAvatar().getBytes();
            String avatarUrl = userService.uploadAvatar(avatarData,request.getAvatar().getOriginalFilename());

            userService.savedUser(userId,avatarUrl);

            return ResponseEntity.ok("User registered successfully with avatar URL: " + avatarUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}/update-info")
    public ApiResponse<UserAccountResponse> updateInfo(@PathVariable Long userId, @ModelAttribute InfoUpdateRequest request) throws IOException {
        return ApiResponse.<UserAccountResponse>builder()
                .result(userService.uploadInfo(userId, request))
                .build();
    }

//    @PostMapping("/login")
//    public ApiResponse<UserAccountResponse> loginAccount(@RequestBody LoginRequest request){
//        return ApiResponse.<UserAccountResponse>builder()
//                .result(userService.loginAccount(request))
//                .build();
//    }

    @PutMapping("/update/{userId}")
    public ApiResponse<UserAccountResponse> updateUser(@PathVariable Long userId, @ModelAttribute RegisterRequest request) throws IOException, SQLException {
        User saveUser = userService.updateUser(userId, request);
        UserAccountResponse response = new UserAccountResponse();
        response.setUserId(saveUser.getUserId());
        response.setUserEmail(saveUser.getUserEmail());
        response.setUsername(saveUser.getUsername());

//        byte[] avatarByte = request.getAvatar().getBytes();
//        if(avatarByte.length >0){
//            String base64Avatar = Base64.encodeBase64String(avatarByte);
//            response.setAvatar(base64Avatar);
//        }

        return ApiResponse.<UserAccountResponse>builder()
                .result(response)
                .build();
    }

    @DeleteMapping("/delete/{userId}")
    public String deleteUser(@PathVariable Long userId){
        userService.deleteUser(userId);
        return "Delete user success";
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<UserAccountResponse> getUserById(@PathVariable Long userId){
        return ApiResponse.<UserAccountResponse>builder()
                .result(userService.getUserById(userId))
                .build();
    }

    @GetMapping("/all-users")
    public ApiResponse<List<User>> getAllUsers(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: {}", authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
        return ApiResponse.<List<User>>builder()
                .result(userService.getAllUsers())
                .build();
    }

}
