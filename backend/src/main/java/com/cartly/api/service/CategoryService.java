package com.cartly.api.service;

import com.cartly.api.entity.Category;
import com.cartly.api.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired private CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> findAll() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(c -> {
                    Map<String, Object> m = new java.util.LinkedHashMap<>();
                    m.put("categoryId", c.getCategoryId());
                    m.put("name", c.getName());
                    m.put("parentId", c.getParent() != null ? c.getParent().getCategoryId() : null);
                    m.put("parentName", c.getParent() != null ? c.getParent().getName() : null);
                    return m;
                })
                .collect(Collectors.toList());
    }
}
