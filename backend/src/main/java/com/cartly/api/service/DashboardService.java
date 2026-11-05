package com.cartly.api.service;

import com.cartly.api.dto.response.DashboardResponse;
import com.cartly.api.repository.OrderItemRepository;
import com.cartly.api.repository.OrderRepository;
import com.cartly.api.repository.ProductRepository;
import com.cartly.api.repository.view.LowStockViewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private ProductRepository productRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private LowStockViewRepository lowStockViewRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        long productCount = productRepository.countByIsActiveTrue();
        long ordersToday = orderRepository.countOrdersToday();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;
        long lowStockCount = lowStockViewRepository.count();

        List<Object[]> recentRaw = orderRepository.findTop5RecentOrders();
        List<DashboardResponse.RecentOrderDto> recentOrders = recentRaw.stream().map(row ->
                new DashboardResponse.RecentOrderDto(
                        ((Number) row[0]).intValue(),
                        (String) row[1],
                        (String) row[2],
                        row[3] != null ? row[3].toString() : null,
                        (String) row[4],
                        (BigDecimal) row[5]
                )).collect(Collectors.toList());

        List<Object[]> sellersRaw = orderItemRepository.findTop5Sellers();
        List<DashboardResponse.TopSellerDto> topSellers = sellersRaw.stream().map(row ->
                new DashboardResponse.TopSellerDto(
                        ((Number) row[0]).intValue(),
                        (String) row[1],
                        ((Number) row[2]).longValue(),
                        (BigDecimal) row[3]
                )).collect(Collectors.toList());

        return new DashboardResponse(productCount, ordersToday, totalRevenue, lowStockCount,
                recentOrders, topSellers);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getCategoryStats() {
        List<Object[]> rows = orderItemRepository.findCategorySales();
        return rows.stream().map(row -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("categoryName", row[0]);
            m.put("totalRevenue", row[1]);
            m.put("orderCount", ((Number) row[2]).longValue());
            return m;
        }).collect(Collectors.toList());
    }
}
