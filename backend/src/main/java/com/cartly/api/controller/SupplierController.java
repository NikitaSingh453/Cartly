package com.cartly.api.controller;

import com.cartly.api.entity.Supplier;
import com.cartly.api.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {

    @Autowired private SupplierService supplierService;

    @GetMapping
    public ResponseEntity<List<Supplier>> list() {
        return ResponseEntity.ok(supplierService.findAll());
    }
}
