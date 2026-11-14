package com.cartly.api.controller;

import com.cartly.api.entity.Address;
import com.cartly.api.entity.Customer;
import com.cartly.api.exception.BadRequestException;
import com.cartly.api.exception.ResourceNotFoundException;
import com.cartly.api.repository.AddressRepository;
import com.cartly.api.repository.CustomerRepository;
import com.cartly.api.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/addresses")
public class AddressController {

    @Autowired private AddressRepository addressRepository;
    @Autowired private CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list(Authentication authentication) {
        UserPrincipal actor = (UserPrincipal) authentication;
        List<Map<String, Object>> result = addressRepository
                .findByCustomerCustomerIdOrderByIsDefaultDescAddressIdAsc(actor.getId())
                .stream().map(this::toMap).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(Authentication authentication,
                                                       @RequestBody Map<String, String> body) {
        UserPrincipal actor = (UserPrincipal) authentication;
        String line1 = body.getOrDefault("line1", "").trim();
        String city  = body.getOrDefault("city",  "").trim();
        String state = body.getOrDefault("state", "").trim();
        String zip   = body.getOrDefault("postalCode", "").trim();
        if (line1.isEmpty() || city.isEmpty() || state.isEmpty() || zip.isEmpty()) {
            throw new BadRequestException("All address fields are required");
        }

        Customer customer = customerRepository.findById(actor.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Address addr = new Address();
        addr.setCustomer(customer);
        addr.setLine1(line1);
        addr.setCity(city);
        addr.setState(state);
        addr.setPostalCode(zip);
        addr.setIsDefault(false);

        return ResponseEntity.status(201).body(toMap(addressRepository.save(addr)));
    }

    private Map<String, Object> toMap(Address a) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("addressId", a.getAddressId());
        m.put("line1", a.getLine1());
        m.put("city", a.getCity());
        m.put("state", a.getState());
        m.put("postalCode", a.getPostalCode());
        m.put("isDefault", a.getIsDefault());
        return m;
    }
}
