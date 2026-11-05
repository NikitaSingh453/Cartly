package com.cartly.api.repository.view;

import com.cartly.api.entity.view.ProductRatingView;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProductRatingViewRepository extends JpaRepository<ProductRatingView, Integer> {
    Optional<ProductRatingView> findByProductId(Integer productId);
}
