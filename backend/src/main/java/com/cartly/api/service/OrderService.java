package com.cartly.api.service;

import com.cartly.api.dto.request.PlaceOrderRequest;
import com.cartly.api.dto.response.OrderDetailResponse;
import com.cartly.api.dto.response.OrderSummaryDto;
import com.cartly.api.entity.*;
import com.cartly.api.exception.BadRequestException;
import com.cartly.api.exception.ResourceNotFoundException;
import com.cartly.api.repository.*;
import com.cartly.api.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private AddressRepository addressRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private InventoryRepository inventoryRepository;
    @Autowired private PaymentRepository paymentRepository;

    @Transactional
    public Map<String, Object> placeOrder(PlaceOrderRequest req, UserPrincipal actor) {
        Address address = addressRepository
                .findByAddressIdAndCustomerCustomerId(req.addressId(), actor.getId())
                .orElseThrow(() -> new BadRequestException("Invalid address"));

        List<Integer> productIds = req.items().stream()
                .map(i -> i.productId()).collect(Collectors.toList());

        List<Inventory> inventories = inventoryRepository.findAndLockByProductIds(productIds);
        Map<Integer, Inventory> invMap = inventories.stream()
                .collect(Collectors.toMap(Inventory::getProductId, i -> i));

        Map<Integer, Product> productMap = productRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getProductId, p -> p));

        for (var item : req.items()) {
            Inventory inv = invMap.get(item.productId());
            if (inv == null || inv.getQuantityOnHand() < item.quantity()) {
                String name = productMap.containsKey(item.productId())
                        ? productMap.get(item.productId()).getName() : "product #" + item.productId();
                throw new BadRequestException("Insufficient stock for: " + name);
            }
        }

        Customer customer = new Customer();
        customer.setCustomerId(actor.getId());

        Order order = new Order();
        order.setCustomer(customer);
        order.setAddress(address);
        order.setOrderDate(OffsetDateTime.now());
        order.setStatus(Order.OrderStatus.PLACED);
        order = orderRepository.save(order);

        for (var item : req.items()) {
            Product product = productMap.get(item.productId());
            OrderItem orderItem = new OrderItem(order, product, item.quantity(), product.getPrice());
            orderItemRepository.save(orderItem);

            Inventory inv = invMap.get(item.productId());
            inv.setQuantityOnHand(inv.getQuantityOnHand() - item.quantity());
            inv.setLastUpdated(OffsetDateTime.now());
        }
        inventoryRepository.saveAll(invMap.values());

        return Map.of("orderId", order.getOrderId(), "message", "Order placed successfully");
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryDto> listOrders(UserPrincipal actor) {
        List<Order> orders = actor.getRole().equals("admin")
                ? orderRepository.findAllByOrderByOrderDateDesc()
                : orderRepository.findByCustomerCustomerIdOrderByOrderDateDesc(actor.getId());

        return orders.stream().map(o -> {
            BigDecimal total = o.getItems() != null
                    ? o.getItems().stream()
                        .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                    : BigDecimal.ZERO;
            return new OrderSummaryDto(o.getOrderId(), o.getOrderDate(), o.getStatus().name(), total);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderById(Integer orderId, UserPrincipal actor) {
        Order order;
        if (actor.getRole().equals("admin")) {
            order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        } else {
            order = orderRepository.findByOrderIdAndCustomerCustomerId(orderId, actor.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        }

        List<OrderItem> items = orderItemRepository.findByOrderOrderId(orderId);
        List<Payment> payments = paymentRepository.findByOrderOrderId(orderId);

        BigDecimal total = items.stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Address addr = order.getAddress();
        OrderDetailResponse.AddressDto addressDto = addr != null
                ? new OrderDetailResponse.AddressDto(addr.getAddressId(), addr.getLine1(),
                    addr.getCity(), addr.getState(), addr.getPostalCode())
                : null;

        List<OrderDetailResponse.OrderItemDto> itemDtos = items.stream()
                .map(i -> new OrderDetailResponse.OrderItemDto(
                        i.getProduct().getProductId(),
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getUnitPrice()))
                .collect(Collectors.toList());

        List<OrderDetailResponse.PaymentDto> paymentDtos = payments.stream()
                .map(p -> new OrderDetailResponse.PaymentDto(
                        p.getPaymentId(), p.getMethod().name(), p.getAmount(),
                        p.getStatus().name(), p.getTransactionRef(), p.getPaidAt()))
                .collect(Collectors.toList());

        return new OrderDetailResponse(orderId, order.getOrderDate(), order.getStatus().name(),
                total, addressDto, itemDtos, paymentDtos);
    }

    @Transactional
    public Map<String, Object> cancelOrder(Integer orderId, UserPrincipal actor) {
        Order order = orderRepository.findAndLockById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!actor.getRole().equals("admin")
                && !order.getCustomer().getCustomerId().equals(actor.getId())) {
            throw new ResourceNotFoundException("Order not found");
        }

        Order.OrderStatus status = order.getStatus();
        if (status != Order.OrderStatus.PLACED && status != Order.OrderStatus.PAID) {
            throw new BadRequestException("Order cannot be cancelled in status: " + status);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);

        List<OrderItem> items = orderItemRepository.findByOrderOrderId(orderId);
        List<Integer> productIds = items.stream()
                .map(i -> i.getProduct().getProductId()).collect(Collectors.toList());
        List<Inventory> inventories = inventoryRepository.findAndLockByProductIds(productIds);
        Map<Integer, Inventory> invMap = inventories.stream()
                .collect(Collectors.toMap(Inventory::getProductId, i -> i));

        for (OrderItem item : items) {
            Inventory inv = invMap.get(item.getProduct().getProductId());
            if (inv != null) {
                inv.setQuantityOnHand(inv.getQuantityOnHand() + item.getQuantity());
                inv.setLastUpdated(OffsetDateTime.now());
            }
        }
        inventoryRepository.saveAll(invMap.values());

        return Map.of("message", "Order cancelled");
    }
}
