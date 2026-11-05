package com.cartly.api.repository.view;

import com.cartly.api.entity.view.LowStockView;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LowStockViewRepository extends JpaRepository<LowStockView, Integer> {
}
