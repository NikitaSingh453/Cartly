package com.cartly.api.entity.view;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;
import java.math.BigDecimal;

@Entity
@Immutable
@Table(name = "product_rating_view")
public class ProductRatingView {

    @Id
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "avg_rating")
    private BigDecimal avgRating;

    @Column(name = "review_count")
    private Long reviewCount;

    public Integer getProductId() { return productId; }
    public BigDecimal getAvgRating() { return avgRating; }
    public Long getReviewCount() { return reviewCount; }
}
