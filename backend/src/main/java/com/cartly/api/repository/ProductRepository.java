package com.cartly.api.repository;

import com.cartly.api.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    long countByIsActiveTrue();

    @Query(value = """
            SELECT p.product_id, p.sku, p.name, p.description, p.price, p.is_active,
                   p.created_at,
                   c.name AS category_name, c.category_id,
                   s.name AS supplier_name, s.supplier_id,
                   COALESCE(i.quantity_on_hand, 0) AS quantity_on_hand,
                   COALESCE(r.avg_rating, 0) AS avg_rating,
                   COALESCE(r.review_count, 0) AS review_count
            FROM product p
            JOIN category c   ON c.category_id = p.category_id
            JOIN supplier s   ON s.supplier_id = p.supplier_id
            LEFT JOIN inventory i ON i.product_id = p.product_id
            LEFT JOIN product_rating_view r ON r.product_id = p.product_id
            WHERE p.is_active = TRUE
              AND (:search IS NULL OR p.name ILIKE :search OR p.description ILIKE :search)
              AND (:categoryId IS NULL OR p.category_id = :categoryId)
              AND (:minPrice IS NULL OR p.price >= :minPrice)
              AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            ORDER BY p.created_at DESC
            """,
            countQuery = """
            SELECT COUNT(*) FROM product p
            WHERE p.is_active = TRUE
              AND (:search IS NULL OR p.name ILIKE :search OR p.description ILIKE :search)
              AND (:categoryId IS NULL OR p.category_id = :categoryId)
              AND (:minPrice IS NULL OR p.price >= :minPrice)
              AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            """,
            nativeQuery = true)
    Page<Object[]> findProductsFiltered(
            @Param("search") String search,
            @Param("categoryId") Integer categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);
}
