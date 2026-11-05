package com.cartly.api.repository;

import com.cartly.api.entity.OrderItem;
import com.cartly.api.entity.OrderItemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemId> {

    List<OrderItem> findByOrderOrderId(Integer orderId);

    @Query(value = """
            SELECT p.product_id, p.name,
                   SUM(oi.quantity) AS total_qty_sold,
                   SUM(oi.quantity * oi.unit_price) AS total_revenue
            FROM order_item oi
            JOIN product p ON p.product_id = oi.product_id
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.status != 'CANCELLED'
            GROUP BY p.product_id, p.name
            ORDER BY total_qty_sold DESC
            LIMIT 5
            """, nativeQuery = true)
    List<Object[]> findTop5Sellers();

    @Query(value = """
            SELECT c.name AS category_name,
                   SUM(oi.quantity * oi.unit_price) AS total_revenue,
                   COUNT(DISTINCT oi.order_id) AS order_count
            FROM order_item oi
            JOIN product p ON p.product_id = oi.product_id
            JOIN category c ON c.category_id = p.category_id
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.status != 'CANCELLED'
            GROUP BY c.name
            ORDER BY total_revenue DESC
            """, nativeQuery = true)
    List<Object[]> findCategorySales();
}
