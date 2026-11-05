package com.cartly.api.controller;

import com.cartly.api.dto.request.CreateProductRequest;
import com.cartly.api.dto.request.UpdateProductRequest;
import com.cartly.api.dto.response.ProductListResponse;
import com.cartly.api.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired private ProductService productService;

    @GetMapping
    public ResponseEntity<ProductListResponse> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer category,
            @RequestParam(name = "min_price", required = false) BigDecimal min_price,
            @RequestParam(name = "max_price", required = false) BigDecimal max_price,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(productService.listProducts(search, category, min_price, max_price, page, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody CreateProductRequest req) {
        return ResponseEntity.status(201).body(productService.createProduct(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Integer id,
                                                       @RequestBody UpdateProductRequest req) {
        return ResponseEntity.ok(productService.updateProduct(id, req));
    }
}
