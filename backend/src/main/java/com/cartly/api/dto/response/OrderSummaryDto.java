package com.cartly.api.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record OrderSummaryDto(
        Integer orderId,
        OffsetDateTime orderDate,
        String status,
        BigDecimal total
) {}
