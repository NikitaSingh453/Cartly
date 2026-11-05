package com.cartly.api.repository;

import com.cartly.api.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Integer> {
    Optional<Address> findByAddressIdAndCustomerCustomerId(Integer addressId, Integer customerId);
}
