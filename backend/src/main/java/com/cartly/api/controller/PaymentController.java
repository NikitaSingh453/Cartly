package com.cartly.api.controller;

import com.cartly.api.dto.request.PaymentRequest;
import com.cartly.api.security.UserPrincipal;
import com.cartly.api.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> recordPayment(@Valid @RequestBody PaymentRequest req,
                                                              Authentication authentication) {
        return ResponseEntity.status(201).body(paymentService.recordPayment(req, (UserPrincipal) authentication));
    }

    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody Map<String, Object> body)
            throws StripeException {
        long amountRupees = ((Number) body.get("amount")).longValue();
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountRupees * 100L)
                .setCurrency("inr")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();
        PaymentIntent intent = PaymentIntent.create(params);
        return ResponseEntity.ok(Map.of("clientSecret", intent.getClientSecret()));
    }
}
