package com.cartly.api.service;

import com.cartly.api.dto.request.PaymentRequest;
import com.cartly.api.entity.*;
import com.cartly.api.exception.BadRequestException;
import com.cartly.api.exception.ResourceNotFoundException;
import com.cartly.api.repository.OrderRepository;
import com.cartly.api.repository.PaymentRepository;
import com.cartly.api.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private PaymentRepository paymentRepository;

    @Transactional
    public Map<String, Object> recordPayment(PaymentRequest req, UserPrincipal actor) {
        Order order = orderRepository.findAndLockById(req.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getCustomer().getCustomerId().equals(actor.getId())) {
            throw new ResourceNotFoundException("Order not found");
        }
        if (order.getStatus() != Order.OrderStatus.PLACED) {
            throw new BadRequestException("Order is not in PLACED status");
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod(req.method());
        payment.setAmount(req.amount());
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setTransactionRef(req.transactionRef());
        payment.setPaidAt(OffsetDateTime.now());
        payment = paymentRepository.save(payment);

        order.setStatus(Order.OrderStatus.PAID);
        orderRepository.save(order);

        return Map.of("paymentId", payment.getPaymentId(), "message", "Payment recorded");
    }
}
