package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {
    
    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService userDetailsService;

    public ResponseEntity<?> validate(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("valid", false));
        }

        try {
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.validateToken(token, userDetails)) {
                String role = userDetails
                        .getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();
                return ResponseEntity.ok(Map.of(
                        "valid", true,
                        "username", username,
                        "role", role
                ));
            }

            return ResponseEntity
                    .status(401)
                    .body(Map.of("valid", false));

        } catch (Exception e) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("valid", false));
        }
    }
}
