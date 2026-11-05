package com.cartly.api.service;

import com.cartly.api.dto.request.CreateProductRequest;
import com.cartly.api.dto.request.UpdateProductRequest;
import com.cartly.api.dto.response.ProductListResponse;
import com.cartly.api.dto.response.ProductSummaryDto;
import com.cartly.api.entity.Category;
import com.cartly.api.entity.Inventory;
import com.cartly.api.entity.Product;
import com.cartly.api.entity.Supplier;
import com.cartly.api.entity.view.ProductRatingView;
import com.cartly.api.exception.ResourceNotFoundException;
import com.cartly.api.repository.*;
import com.cartly.api.repository.view.ProductRatingViewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SupplierRepository supplierRepository;
    @Autowired private InventoryRepository inventoryRepository;
    @Autowired private ReviewRepository reviewRepository;
    @Autowired private ProductRatingViewRepository ratingViewRepository;

    @Transactional(readOnly = true)
    public ProductListResponse listProducts(String search, Integer categoryId,
                                             BigDecimal minPrice, BigDecimal maxPrice,
                                             int page, int limit) {
        String searchParam = (search != null && !search.isBlank()) ? "%" + search + "%" : null;
        PageRequest pageable = PageRequest.of(page - 1, limit);
        Page<Object[]> result = productRepository.findProductsFiltered(
                searchParam, categoryId, minPrice, maxPrice, pageable);

        List<ProductSummaryDto> products = result.getContent().stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
        return new ProductListResponse(products, result.getTotalElements(), page, limit);
    }

    private ProductSummaryDto mapToSummaryDto(Object[] row) {
        return new ProductSummaryDto(
                ((Number) row[0]).intValue(),    // product_id
                (String) row[1],                  // sku
                (String) row[2],                  // name
                (String) row[3],                  // description
                (BigDecimal) row[4],              // price
                (Boolean) row[5],                 // is_active
                (String) row[7],                  // category_name
                ((Number) row[8]).intValue(),     // category_id
                (String) row[9],                  // supplier_name
                ((Number) row[10]).intValue(),    // supplier_id
                ((Number) row[11]).intValue(),    // quantity_on_hand
                (BigDecimal) row[12],             // avg_rating
                ((Number) row[13]).longValue()    // review_count
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        ProductRatingView rating = ratingViewRepository.findByProductId(id).orElse(null);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("productId", product.getProductId());
        result.put("sku", product.getSku());
        result.put("name", product.getName());
        result.put("description", product.getDescription());
        result.put("price", product.getPrice());
        result.put("isActive", product.getIsActive());
        result.put("categoryId", product.getCategory() != null ? product.getCategory().getCategoryId() : null);
        result.put("categoryName", product.getCategory() != null ? product.getCategory().getName() : null);
        result.put("supplierId", product.getSupplier() != null ? product.getSupplier().getSupplierId() : null);
        result.put("supplierName", product.getSupplier() != null ? product.getSupplier().getName() : null);
        result.put("quantityOnHand", product.getInventory() != null ? product.getInventory().getQuantityOnHand() : 0);
        result.put("avgRating", rating != null ? rating.getAvgRating() : BigDecimal.ZERO);
        result.put("reviewCount", rating != null ? rating.getReviewCount() : 0);

        List<Map<String, Object>> reviews = reviewRepository
                .findByProductProductIdOrderByCreatedAtDesc(id)
                .stream()
                .map(r -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("reviewId", r.getReviewId());
                    m.put("customerId", r.getCustomer().getCustomerId());
                    m.put("customerName", r.getCustomer().getName());
                    m.put("rating", r.getRating());
                    m.put("title", r.getTitle());
                    m.put("comment", r.getComment());
                    m.put("createdAt", r.getCreatedAt());
                    return m;
                })
                .collect(Collectors.toList());
        result.put("reviews", reviews);

        return result;
    }

    @Transactional
    public Map<String, Object> createProduct(CreateProductRequest req) {
        Category category = categoryRepository.findById(req.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Supplier supplier = supplierRepository.findById(req.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        Product product = new Product();
        product.setSku(req.sku());
        product.setName(req.name());
        product.setDescription(req.description());
        product.setPrice(req.price());
        product.setCategory(category);
        product.setSupplier(supplier);
        product.setIsActive(true);
        product.setCreatedAt(OffsetDateTime.now());
        product = productRepository.save(product);

        Inventory inventory = new Inventory();
        inventory.setProduct(product);
        inventory.setQuantityOnHand(req.quantityOnHand() != null ? req.quantityOnHand() : 0);
        inventory.setReorderLevel(req.reorderLevel() != null ? req.reorderLevel() : 0);
        inventory.setLastUpdated(OffsetDateTime.now());
        inventoryRepository.save(inventory);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("productId", product.getProductId());
        response.put("message", "Product created");
        return response;
    }

    @Transactional
    public Map<String, Object> updateProduct(Integer id, UpdateProductRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (req.name() != null) product.setName(req.name());
        if (req.description() != null) product.setDescription(req.description());
        if (req.price() != null) product.setPrice(req.price());
        if (req.isActive() != null) product.setIsActive(req.isActive());
        if (req.categoryId() != null) {
            Category cat = categoryRepository.findById(req.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(cat);
        }
        if (req.supplierId() != null) {
            Supplier sup = supplierRepository.findById(req.supplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
            product.setSupplier(sup);
        }
        productRepository.save(product);

        if (req.quantityOnHand() != null || req.reorderLevel() != null) {
            Inventory inv = inventoryRepository.findById(id).orElse(null);
            if (inv != null) {
                if (req.quantityOnHand() != null) inv.setQuantityOnHand(req.quantityOnHand());
                if (req.reorderLevel() != null) inv.setReorderLevel(req.reorderLevel());
                inv.setLastUpdated(OffsetDateTime.now());
                inventoryRepository.save(inv);
            }
        }

        return Map.of("message", "Product updated");
    }
}
