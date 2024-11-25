package com.backend.authentication.repository;

import com.backend.authentication.entity.FriendRequest;
import com.backend.authentication.entity.User;
import com.backend.authentication.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    List<FriendRequest> findByReceiverAndStatus(User receiver, Status status);

    List<FriendRequest> findByRequesterAndStatus(User requester, Status status);

    Optional<FriendRequest> findByRequesterUserIdAndReceiverUserId(Long requesterId, Long receiverId);

    @Query("SELECT f.requester FROM FriendRequest f WHERE f.receiver.id = :userId AND f.status = com.backend.authentication.enums.Status.ACCEPTED " +
            "UNION " +
            "SELECT f.receiver FROM FriendRequest f WHERE f.requester.id = :userId AND f.status = com.backend.authentication.enums.Status.ACCEPTED")
    List<User> findFriendsByUserId(@Param("userId") Long userId);
}
