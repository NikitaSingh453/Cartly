package com.cartly.api.controller;

import com.cartly.api.dto.request.PlaceOrderRequest;
import com.cartly.api.dto.response.OrderDetailResponse;
import com.cartly.api.dto.response.OrderSummaryDto;
import com.cartly.api.security.UserPrincipal;
import com.cartly.api.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired private OrderService orderService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> placeOrder(@Valid @RequestBody PlaceOrderRequest req,
                                                           Authentication authentication) {
        return ResponseEntity.status(201).body(orderService.placeOrder(req, (UserPrincipal) authentication));
    }

    @GetMapping
    public ResponseEntity<List<OrderSummaryDto>> listOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.listOrders((UserPrincipal) authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> getOrder(@PathVariable Integer id,
                                                         Authentication authentication) {
        return ResponseEntity.ok(orderService.getOrderById(id, (UserPrincipal) authentication));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(@PathVariable Integer id,
                                                            Authentication authentication) {
        return ResponseEntity.ok(orderService.cancelOrder(id, (UserPrincipal) authentication));
    }
}
