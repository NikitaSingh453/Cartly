package com.cartly.api.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        long productCount,
        long ordersToday,
        BigDecimal totalRevenue,
        long lowStockCount,
        List<RecentOrderDto> recentOrders,
        List<TopSellerDto> topSellers
) {
    public record RecentOrderDto(Integer orderId, String customerName, String email,
                                  String orderDate, String status, BigDecimal total) {}

    public record TopSellerDto(Integer productId, String name, Long totalQtySold, BigDecimal totalRevenue) {}
}
