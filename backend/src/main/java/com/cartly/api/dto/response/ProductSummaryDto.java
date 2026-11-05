package com.cartly.api.dto.response;

import java.math.BigDecimal;

public record ProductSummaryDto(
        Integer productId,
        String sku,
        String name,
        String description,
        BigDecimal price,
        Boolean isActive,
        String categoryName,
        Integer categoryId,
        String supplierName,
        Integer supplierId,
        Integer quantityOnHand,
        BigDecimal avgRating,
        Long reviewCount
) {}
