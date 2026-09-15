package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Users;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    public <T extends Users> T register(T user, UserRepository<T> repo) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public <T extends Users> String verify(T user, UserRepository<T> repo) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        if (authentication.isAuthenticated()) {
            T authenticatedUser = repo.findByUsername(user.getUsername());
            return jwtService.generateJwtToken(authenticatedUser.getUsername(), authenticatedUser.getRole());
        }
        return "failed";
    }
}