package com.backend.authentication.entity;

import com.backend.authentication.dto.response.CommunityResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Community {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String backgroundImg;

    String name;

    String avatar;

    @OneToMany(mappedBy = "community", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    List<Post> posts;

    @ManyToMany(mappedBy = "communities")
    @JsonManagedReference
    List<User> members;

//    @ManyToMany(mappedBy = "communities")
//    @JsonIgnore
//    List<CustomFeed> customFeeds;

    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "userId", nullable = false)
    User owner;


    String description;

    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    LocalDateTime createAt;

    List<String> rules;

    public CommunityResponse toCommunityResponse(){
        CommunityResponse communityResponse = new CommunityResponse();
        communityResponse.setCommunityId(id);
        communityResponse.setOwnerId(owner.getUserId());
        communityResponse.setName(name);
        communityResponse.setAvatar(avatar);
        communityResponse.setBackgroundImg(backgroundImg);
        communityResponse.setDescription(description);
        communityResponse.setMembers(members);
        communityResponse.setCreateAt(createAt);

        return communityResponse;
    }
}
