package com.cartly.api.controller;

import com.cartly.api.dto.request.CreateReviewRequest;
import com.cartly.api.dto.response.ReviewDto;
import com.cartly.api.security.UserPrincipal;
import com.cartly.api.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody CreateReviewRequest req,
                                                       @AuthenticationPrincipal UserPrincipal actor) {
        return ResponseEntity.status(201).body(reviewService.createReview(req, actor));
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<List<ReviewDto>> getForProduct(@PathVariable Integer id) {
        return ResponseEntity.ok(reviewService.getReviewsForProduct(id));
    }
}
