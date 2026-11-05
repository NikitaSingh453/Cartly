package com.cartly.api.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record ReviewDto(
        Integer reviewId,
        Integer productId,
        Integer customerId,
        String customerName,
        Integer rating,
        String title,
        String comment,
        OffsetDateTime createdAt
) {}
