package com.cartly.api.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record OrderDetailResponse(
        Integer orderId,
        OffsetDateTime orderDate,
        String status,
        BigDecimal total,
        AddressDto address,
        List<OrderItemDto> items,
        List<PaymentDto> payments
) {
    public record AddressDto(Integer addressId, String line1, String city, String state, String postalCode) {}

    public record OrderItemDto(Integer productId, String productName, Integer quantity, BigDecimal unitPrice) {}

    public record PaymentDto(Integer paymentId, String method, BigDecimal amount, String status,
                             String transactionRef, OffsetDateTime paidAt) {}
}
