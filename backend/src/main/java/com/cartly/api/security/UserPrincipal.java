package com.cartly.api.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public class UserPrincipal extends UsernamePasswordAuthenticationToken {

    private final Integer id;
    private final String role;

    public UserPrincipal(Integer id, String role) {
        super(id, null, List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())));
        this.id = id;
        this.role = role;
    }

    public Integer getId() {
        return id;
    }

    public String getRole() {
        return role;
    }
}
