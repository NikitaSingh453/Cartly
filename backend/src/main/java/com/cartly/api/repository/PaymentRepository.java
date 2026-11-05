package com.cartly.api.repository;

import com.cartly.api.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByOrderOrderId(Integer orderId);
}
