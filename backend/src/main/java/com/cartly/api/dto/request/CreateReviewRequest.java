package com.cartly.api.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateReviewRequest(
        @NotNull Integer productId,
        @NotNull @Min(1) @Max(5) Integer rating,
        String title,
        String comment
) {}
