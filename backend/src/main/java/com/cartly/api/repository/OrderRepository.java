package com.cartly.api.repository;

import com.cartly.api.entity.Order;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByCustomerCustomerIdOrderByOrderDateDesc(Integer customerId);

    List<Order> findAllByOrderByOrderDateDesc();

    Optional<Order> findByOrderIdAndCustomerCustomerId(Integer orderId, Integer customerId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.orderId = :id")
    Optional<Order> findAndLockById(@Param("id") Integer id);

    @Query(value = "SELECT COUNT(*) FROM orders WHERE order_date::date = CURRENT_DATE", nativeQuery = true)
    long countOrdersToday();

    @Query(value = """
            SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0)
            FROM order_item oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.status != 'CANCELLED'
            """, nativeQuery = true)
    BigDecimal sumTotalRevenue();

    @Query(value = """
            SELECT o.order_id, c.name AS customer_name, c.email,
                   o.order_date, o.status,
                   COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS total
            FROM orders o
            JOIN customer c ON c.customer_id = o.customer_id
            LEFT JOIN order_item oi ON oi.order_id = o.order_id
            GROUP BY o.order_id, c.name, c.email, o.order_date, o.status
            ORDER BY o.order_date DESC
            LIMIT 5
            """, nativeQuery = true)
    List<Object[]> findTop5RecentOrders();
}
