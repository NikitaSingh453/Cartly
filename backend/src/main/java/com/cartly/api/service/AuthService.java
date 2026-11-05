package com.cartly.api.service;

import com.cartly.api.dto.request.LoginRequest;
import com.cartly.api.dto.request.RegisterRequest;
import com.cartly.api.dto.response.AuthResponse;
import com.cartly.api.dto.response.CustomerDto;
import com.cartly.api.entity.Customer;
import com.cartly.api.exception.BadRequestException;
import com.cartly.api.exception.ConflictException;
import com.cartly.api.repository.CustomerRepository;
import com.cartly.api.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class AuthService {

    @Autowired private CustomerRepository customerRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (customerRepository.existsByEmail(req.email())) {
            throw new ConflictException("Email already registered");
        }
        Customer customer = new Customer();
        customer.setName(req.name());
        customer.setEmail(req.email());
        customer.setPhone(req.phone());
        customer.setPasswordHash(passwordEncoder.encode(req.password()));
        customer.setRole(Customer.Role.customer);
        customer.setCreatedAt(OffsetDateTime.now());
        customer = customerRepository.save(customer);

        String token = jwtUtil.generateToken(customer.getCustomerId(), customer.getRole().name());
        return new AuthResponse(token, toDto(customer));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        Customer customer = customerRepository.findByEmail(req.email())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));
        if (!passwordEncoder.matches(req.password(), customer.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(customer.getCustomerId(), customer.getRole().name());
        return new AuthResponse(token, toDto(customer));
    }

    private CustomerDto toDto(Customer c) {
        return new CustomerDto(c.getCustomerId(), c.getName(), c.getEmail(), c.getRole().name());
    }
}
