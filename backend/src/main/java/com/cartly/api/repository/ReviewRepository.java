package com.cartly.api.repository;

import com.cartly.api.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findByProductProductIdOrderByCreatedAtDesc(Integer productId);

    @Query(value = """
            SELECT COUNT(*) > 0
            FROM order_item oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE oi.product_id = :productId
              AND o.customer_id = :customerId
              AND o.status IN ('PAID', 'SHIPPED', 'DELIVERED')
            """, nativeQuery = true)
    boolean hasPurchasedProduct(@Param("productId") Integer productId, @Param("customerId") Integer customerId);
}
