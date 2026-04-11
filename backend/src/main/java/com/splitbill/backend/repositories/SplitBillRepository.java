package com.splitbill.backend.repositories;

import com.splitbill.backend.models.SplitBillSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SplitBillRepository extends MongoRepository<SplitBillSession, String> {

    List<SplitBillSession> findByUserIdOrderByCreatedAtDesc(String userId);

    Page<SplitBillSession> findByUserId(String userId, Pageable pageable);
}
