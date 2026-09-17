package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;


import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Users;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.exceptions.UserExistsException;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
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

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder(10);


    // ---------------------------------------------
    // REGISTER
    // ---------------------------------------------

    public <T extends Users> T register(
            T user,
            UserRepository<T> repo) {

        T existingUser = repo.findByUsername(user.getUsername());

        if (existingUser != null) {
            throw new UserExistsException();
        }

        user.setPassword(encoder.encode(user.getPassword()));

        return repo.save(user);
    }


    // ---------------------------------------------
    // LOGIN
    // ---------------------------------------------

    public <T extends Users> String verify(
            T user,
            UserRepository<T> repo) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.getUsername(),
                                user.getPassword()
                        )
                );

        if (authentication.isAuthenticated()) {

            T authenticatedUser =
                    repo.findByUsername(user.getUsername());

            if (authenticatedUser == null) {
                return "failed";
            }

            return jwtService.generateJwtToken(
                    authenticatedUser.getUsername(),
                    authenticatedUser.getRole()
            );
        }

        return "failed";
    }


    // ---------------------------------------------
    // LOGOUT
    // ---------------------------------------------

    public String logout(HttpServletRequest request) {

        String authHeader =
                request.getHeader("Authorization");

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            tokenBlacklistService.blacklistToken(token);

            return "Logout successful";
        }

        return "No token found";
    }
}