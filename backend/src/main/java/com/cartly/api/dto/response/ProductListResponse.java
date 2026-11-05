package com.cartly.api.dto.response;

import java.util.List;

public record ProductListResponse(
        List<ProductSummaryDto> products,
        long total,
        int page,
        int limit
) {}
