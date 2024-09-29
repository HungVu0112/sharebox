package com.backend.authentication.service;

import com.backend.authentication.dto.request.TopicRequest;
import com.backend.authentication.entity.Topic;
import com.backend.authentication.exception.AppException;
import com.backend.authentication.exception.ErrorCode;
import com.backend.authentication.repository.TopicRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TopicService {
    TopicRepository topicRepository;

    public Topic addTopic(TopicRequest topic){
        Topic topic1 = new Topic();
        topic1.setContentTopic(topic.getTopic());
        topicRepository.save(topic1);
        return topic1;
    }

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public void deleteTopic(Long topicId){
        topicRepository.deleteById(topicId);
    }

    public Topic updateTopic(Long topicId, TopicRequest request) {
        Topic topic = topicRepository.findById(topicId).orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_FOUND));
        topic.setContentTopic(request.getTopic());
        topicRepository.save(topic);
        return topic;
    }
}
