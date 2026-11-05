package com.cartly.api.service;

import com.cartly.api.dto.request.CreateReviewRequest;
import com.cartly.api.dto.response.ReviewDto;
import com.cartly.api.entity.Customer;
import com.cartly.api.entity.Product;
import com.cartly.api.entity.Review;
import com.cartly.api.exception.ConflictException;
import com.cartly.api.exception.ForbiddenException;
import com.cartly.api.exception.ResourceNotFoundException;
import com.cartly.api.repository.ProductRepository;
import com.cartly.api.repository.ReviewRepository;
import com.cartly.api.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private ProductRepository productRepository;

    @Transactional
    public Map<String, Object> createReview(CreateReviewRequest req, UserPrincipal actor) {
        if (!reviewRepository.hasPurchasedProduct(req.productId(), actor.getId())) {
            throw new ForbiddenException("You must purchase this product before reviewing it");
        }
        Product product = productRepository.findById(req.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Customer customer = new Customer();
        customer.setCustomerId(actor.getId());

        Review review = new Review();
        review.setProduct(product);
        review.setCustomer(customer);
        review.setRating(req.rating().shortValue());
        review.setTitle(req.title());
        review.setComment(req.comment());
        review.setCreatedAt(OffsetDateTime.now());

        try {
            review = reviewRepository.save(review);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("You have already reviewed this product");
        }

        return Map.of("reviewId", review.getReviewId(), "message", "Review submitted");
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsForProduct(Integer productId) {
        return reviewRepository.findByProductProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(r -> new ReviewDto(
                        r.getReviewId(),
                        r.getProduct().getProductId(),
                        r.getCustomer().getCustomerId(),
                        r.getCustomer().getName(),
                        r.getRating().intValue(),
                        r.getTitle(),
                        r.getComment(),
                        r.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
