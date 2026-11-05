package com.cartly.api.entity.view;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;
import java.math.BigDecimal;

@Entity
@Immutable
@Table(name = "order_total_view")
public class OrderTotalView {

    @Id
    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "email")
    private String email;

    @Column(name = "total")
    private BigDecimal total;

    public Integer getOrderId() { return orderId; }
    public String getCustomerName() { return customerName; }
    public String getEmail() { return email; }
    public BigDecimal getTotal() { return total; }
}
