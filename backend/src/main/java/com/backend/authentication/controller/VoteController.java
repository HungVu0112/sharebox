package com.backend.authentication.controller;

import com.backend.authentication.enums.VoteType;
import com.backend.authentication.service.VoteService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vote")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoteController {

    VoteService voteService;

    @PostMapping("/{userId}/{postId}")
    public void vote(@PathVariable Long userId, @PathVariable Long postId, @RequestParam VoteType voteType){
        voteService.vote(postId, voteType, userId);
    }

}
