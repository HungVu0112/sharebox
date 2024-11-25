package com.backend.authentication.dto.response;

import com.backend.authentication.enums.Status;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendPendingResponse {

    Long requestId;
    Long requesterId;
    Status status;

}
