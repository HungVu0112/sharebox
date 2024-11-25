package com.backend.authentication.entity;

import com.backend.authentication.dto.response.FriendPendingResponse;
import com.backend.authentication.enums.Status;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    @JsonBackReference("user-requester")
    User requester;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    @JsonBackReference("user-receiver")
    User receiver;

    @Enumerated(EnumType.STRING)
    Status status;

    public FriendPendingResponse toFriendPendingResponse(){
        FriendPendingResponse friendPendingResponse = new FriendPendingResponse();
        friendPendingResponse.setRequestId(id);
        friendPendingResponse.setRequesterId(requester.getUserId());
        friendPendingResponse.setStatus(status);

        return friendPendingResponse;
    }

}
