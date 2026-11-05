package com.cartly.api.dto.request;

import java.math.BigDecimal;

public record UpdateProductRequest(
        String name,
        String description,
        BigDecimal price,
        Integer categoryId,
        Integer supplierId,
        Boolean isActive,
        Integer quantityOnHand,
        Integer reorderLevel
) {}
