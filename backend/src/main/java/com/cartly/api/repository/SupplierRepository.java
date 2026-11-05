package com.cartly.api.repository;

import com.cartly.api.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    List<Supplier> findAllByOrderByNameAsc();
}
