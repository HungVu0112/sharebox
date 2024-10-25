package com.backend.authentication.dto.response;

import com.backend.authentication.enums.VoteType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoteResponse {

    VoteType voteType;

}
