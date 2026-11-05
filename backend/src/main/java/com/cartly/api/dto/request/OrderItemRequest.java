package com.cartly.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
        @NotNull Integer productId,
        @NotNull @Min(1) Integer quantity
) {}
