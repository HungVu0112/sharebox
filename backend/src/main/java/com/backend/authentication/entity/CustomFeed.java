package com.backend.authentication.entity;

import com.backend.authentication.dto.response.CustomFeedResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomFeed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;

    String description;

    @ManyToMany
    @JoinTable(
            name = "custom_feed_communities",
            joinColumns = @JoinColumn(name = "custom_feed_id"),
            inverseJoinColumns = @JoinColumn(name = "community_id")
    )
    List<Community> communities;

    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "userId", nullable = false)
    User owner;

    String status;

    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    LocalDateTime createAt;

    public CustomFeedResponse toCustomFeedResponse(){
        CustomFeedResponse customFeedResponse = new CustomFeedResponse();
        customFeedResponse.setCustomfeedId(id);
        customFeedResponse.setOwnerId(owner.getUserId());
        customFeedResponse.setName(name);
        customFeedResponse.setDescription(description);
        if (communities != null) {
            customFeedResponse.setCommunities(communities.stream()
                    .map(community -> community.getId())
                    .collect(Collectors.toList()));
        } else {
            customFeedResponse.setCommunities(Collections.emptyList());
        }
        customFeedResponse.setCreateAt(createAt);

        return customFeedResponse;
    }
}
