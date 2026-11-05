package com.cartly.api.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                String token = header.substring(7);
                Claims claims = jwtUtil.extractClaims(token);
                Integer id = claims.get("id", Integer.class);
                String role = claims.get("role", String.class);
                UserPrincipal principal = new UserPrincipal(id, role);
                SecurityContextHolder.getContext().setAuthentication(principal);
            } catch (Exception ignored) {
                // Invalid token — SecurityContext remains unauthenticated, Spring Security returns 401
            }
        }
        filterChain.doFilter(request, response);
    }
}
