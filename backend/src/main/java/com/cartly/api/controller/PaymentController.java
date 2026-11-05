package com.cartly.api.controller;

import com.cartly.api.dto.request.PaymentRequest;
import com.cartly.api.security.UserPrincipal;
import com.cartly.api.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> recordPayment(@Valid @RequestBody PaymentRequest req,
                                                              @AuthenticationPrincipal UserPrincipal actor) {
        return ResponseEntity.status(201).body(paymentService.recordPayment(req, actor));
    }
}
