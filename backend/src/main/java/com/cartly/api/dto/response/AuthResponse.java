package com.cartly.api.dto.response;

public record AuthResponse(
        String token,
        CustomerDto user
) {}
