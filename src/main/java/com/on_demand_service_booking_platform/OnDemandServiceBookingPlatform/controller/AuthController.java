package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.JwtService;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @GetMapping("/validate")
    public ResponseEntity<?> validate(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

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
