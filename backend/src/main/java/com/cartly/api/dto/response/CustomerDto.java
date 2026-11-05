package com.cartly.api.dto.response;

public record CustomerDto(
        Integer customerId,
        String name,
        String email,
        String role
) {}
