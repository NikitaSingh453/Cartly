package com.cartly.api.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CreateProductRequest(
        @NotBlank String sku,
        @NotBlank String name,
        String description,
        @NotNull @DecimalMin("0") BigDecimal price,
        @NotNull Integer categoryId,
        @NotNull Integer supplierId,
        Integer quantityOnHand,
        Integer reorderLevel
) {}
