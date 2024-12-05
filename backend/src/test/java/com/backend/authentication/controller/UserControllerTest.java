package com.backend.authentication.controller;

import com.backend.authentication.dto.request.RegisterRequest;
import com.backend.authentication.dto.request.UserAddTopicRequest;
import com.backend.authentication.dto.response.UserAccountResponse;
import com.backend.authentication.entity.Topic;
import com.backend.authentication.entity.User;
import com.backend.authentication.exception.AppException;
import com.backend.authentication.exception.ErrorCode;
import com.backend.authentication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

//    @MockBean
//    private AuthenticationService authenticationService;

    @MockBean
    private UserService userService;

    @Autowired
    private RestTemplate restTemplate;

    private MockRestServiceServer mockServer;

    @BeforeEach
    void setUp() {
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    private RegisterRequest request;
    private UserAccountResponse response;

    @BeforeEach
    void initData(){

        request = RegisterRequest.builder()
                .userEmail("duc@gmail.com")
                .password("12345")
                .build();

        response = UserAccountResponse.builder()
                .userId(24L)
                .username("User24")
                .userEmail("duc@gmail.com")
                .avatar("https://eluflzblngwpnjifvwqo.supabase.co/storage/v1/object/public/images/avatars/uchiha.jpg")
                .role(new HashSet<>(Set.of("USER")))
                .build();
    }

    @Test
    void registerAccount_validRequest_success() throws Exception {
        //GIVEN (du lieu dau vao biet truoc va du doan se xay ra nhu vay) Vd resquest, response se la given

        Mockito.when(userService.registerAccount(ArgumentMatchers.any()))
                .thenReturn(response);

        //WHEN (khi test cai j ?)
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/register")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .param("userEmail", request.getUserEmail())
                        .param("password", request.getPassword()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000))
                .andExpect(MockMvcResultMatchers.jsonPath("result.userId").value(24L)
                );
        //THEN (khi when xay ra thi expect dieu j)

    }

    @Test
    void registerAccount_invalidRequest_false() throws Exception {
        // Given

        String duplicateEmail = "madara@gmail.com";
        Mockito.when(userService.registerAccount(ArgumentMatchers.any()))
                .thenThrow(new AppException(ErrorCode.USER_EXISTED));

        // When

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/register")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .param("userEmail", duplicateEmail)
                        .param("password", "123456"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1002))
                .andExpect(MockMvcResultMatchers.jsonPath("message").value("User existed"));


        // Then
    }

    @Test
    void getMyInfo_success() throws Exception {
        UserAccountResponse mockResponse = UserAccountResponse.builder()
                .userId(7L)
                .username("Uchiha Itachi")
                .userEmail("itachi@gmail.com")
                .avatar("https://eluflzblngwpnjifvwqo.supabase.co/storage/v1/object/public/images/avatars/uchiha.jpg")
                .role(new HashSet<>(Set.of("USER")))
                .build();

        Mockito.when(userService.getMyInfo()).thenReturn(mockResponse);

        String mockToken = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzaGFyZWJveC1hdXRoLmNvbSIsInN1YiI6IlVjaGloYSBJdGFjaGkiLCJleHAiOjE3MzI3OTc3MzgsImlhdCI6MTczMjc5NDEzOCwianRpIjoiMTQ2ODllNTQtNDM5OC00OWNiLWFmZWEtZjQyYzNkMTM3NjBhIiwic2NvcGUiOiJVU0VSIn0.UxQdCf2RMPsJFlmLZ5fv6YC5C2DM_N7aBgqk_tMW7xtLY5Anc8z9eWQoFvMcKmJ-YLmJnsg2tbp8uR1TBu7Sxw";

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/users/myInfo")
                        .header("Authorization", mockToken))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000));
    }

    @Test
    void getMyInfo_fail_invalidToken() throws Exception {
        // Mock token không hợp lệ
        String invalidToken = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzaGFyZWJveC1hdXRoLmNvbSIsInN1YiI6IlVjaGloYSBJdGFjaGkiLCJleHAiOjE3MzI3MjYwOTMsImlhdCI6MTczMjcyMjQ5MywianRpIjoiNGIxOTQwZTQtMjUyNS00ZmMzLWJjNjMtOTFkNzQ3NTYyMDVjIiwic2NvcGUiOiJVU0VSIn0.LEn6kBf9gDeZzPY8fhGCQaSyXTVtir_88ZfCNy8IH49kea9p21Nc0FEAGwyJjwE3S-E2PdxloPdNk_vGK7HOZw";

        // Mock phản hồi introspect trả về không hợp lệ
//        Mockito.when(authenticationService.introspect(Mockito.any(IntrospectRequest.class)))
//                        .thenThrow( new JwtException("Token invalid"));

        // Gửi request với token không hợp lệ
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/users/myInfo")
                        .header("Authorization", invalidToken))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());  // Trả về 401 Unauthorized khi token không hợp lệ
    }

    @Test
    void testUpdateUser_Success() throws Exception {
        // Mock dữ liệu đầu vào
        Long userId = 6L;
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newUsername");
        request.setUserEmail("newEmail@example.com");

        User updatedUser = new User();
        updatedUser.setUserId(userId);
        updatedUser.setUsername(request.getUsername());
        updatedUser.setUserEmail(request.getUserEmail());

        // Mock service
        Mockito.when(userService.updateUser(Mockito.eq(userId), Mockito.any(RegisterRequest.class)))
                .thenReturn(updatedUser);

        // When

        mockMvc.perform(MockMvcRequestBuilders
                        .put("/users/update/" + userId)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .param("username", request.getUsername())
                        .param("userEmail", request.getUserEmail()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000))
                .andExpect(MockMvcResultMatchers.jsonPath("result.username").value("newUsername"));

    }

    @Test
    void testAddTopics_Success() throws Exception {
        Long userId = 7L;

        Topic topic1 = Topic.builder()
                .id(1L)
                .contentTopic("ANIME")
                .build();

        Topic topic2 = Topic.builder()
                .id(2L)
                .contentTopic("MANGA")
                .build();

        List<Topic> topics = List.of(topic1,topic2);

        UserAccountResponse response = UserAccountResponse
                .builder()
                .userTopics(topics)
                .build();

        Mockito.when(userService.addTopics(Mockito.eq(userId), Mockito.any(UserAddTopicRequest.class)))
                .thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/" + userId + "/select-topics")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"topicsId\": [1, 2]}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000))
                .andExpect(MockMvcResultMatchers.jsonPath("result.userTopics[0].id").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("result.userTopics[0].contentTopic").value("ANIME"))
                .andExpect(MockMvcResultMatchers.jsonPath("result.userTopics[1].id").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("result.userTopics[1].contentTopic").value("MANGA"));
    }

    @Test
    void testUploadAvatar_Success() throws Exception {
        Long userId = 6L;
        MockMultipartFile avatarFile = new MockMultipartFile(
                "avatar",
                "avatar.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "itachi.jpeg".getBytes()
        );

        String supabaseUrl = "https://eluflzblngwpnjifvwqo.supabase.co/storage/v1/object/images/";
        String expectedUrl = supabaseUrl + "avatars/" + userId + "/avatar.jpg";

//        mockServer.expect(ExpectedCount.once(),
//                        requestTo(expectedUrl))
//                .andExpect(method(HttpMethod.POST))
//                .andRespond(withSuccess("Avatar uploaded successfully", MediaType.TEXT_PLAIN));

        Mockito.when(userService.uploadAvatar(Mockito.any(byte[].class), Mockito.eq(userId), Mockito.eq("avatar.jpg")))
                .thenReturn(expectedUrl);

        System.out.println(expectedUrl);


        mockMvc.perform(MockMvcRequestBuilders
                        .multipart("/users/{userId}/upload-avatar", userId)
                        .file(avatarFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("User registered successfully with avatar URL: " + expectedUrl));

        mockServer.verify();
        //Mockito.verify(userService).uploadAvatar(Mockito.any(byte[].class), Mockito.eq(userId), Mockito.eq("avatar.jpg"));
    }



}
