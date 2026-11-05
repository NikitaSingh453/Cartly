package com.cartly.api.entity.view;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "low_stock_view")
public class LowStockView {

    @Id
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "sku")
    private String sku;

    @Column(name = "name")
    private String name;

    @Column(name = "quantity_on_hand")
    private Integer quantityOnHand;

    @Column(name = "reorder_level")
    private Integer reorderLevel;

    public Integer getProductId() { return productId; }
    public String getSku() { return sku; }
    public String getName() { return name; }
    public Integer getQuantityOnHand() { return quantityOnHand; }
    public Integer getReorderLevel() { return reorderLevel; }
}
