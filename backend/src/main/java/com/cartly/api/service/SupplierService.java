package com.cartly.api.service;

import com.cartly.api.entity.Supplier;
import com.cartly.api.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierService {

    @Autowired private SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public List<Supplier> findAll() {
        return supplierRepository.findAllByOrderByNameAsc();
    }
}
