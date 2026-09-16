package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.JwtService;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/* why AuthController?
 * eg (pb):(clicks on "Explore" --> successful /customer/login --> <Services/>
 *                              when clicks on "back to home".
 *     It shouldn't ask login again right when user clicks on "Explore" again?
 *    )
 * sol: adding a lightweight token-validation endpoint
 */




/* You're thinking of JwtService.validateToken(token, userDetails) — that one's already
 * there. But it's a private-ish internal Java method, not an HTTP endpoint. It only gets called
 * inside JwtFilter, on the backend, for every request that already has a token attached.
 * The problem is your React frontend has no way to call that method — it's not exposed over
 * HTTP. All the frontend has is localStorage.getItem("token"), and it has no way to ask "hey
 * backend, is this token still valid?" before deciding whether to redirect to /customer/login.
 * That's the only reason AuthController with /auth/validate exists — it's a thin HTTP
 * wrapper so the frontend can call:
 *          GET /auth/validate
 *          Authorization: Bearer <token>
 * and get back { valid: true/false }, reusing your existing
 * jwtService.validateToken(...) under the hood. Look at the new controller again:
 *
 *
 * SO,
 * What you already have
 *   JwtService.validateToken() — internal check used by the filter on every protected request
 *
 * What's new:
 * AuthController /auth/validate — an endpoint the frontend can call directly to
 * check login status before rendering/redirecting
 */


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
