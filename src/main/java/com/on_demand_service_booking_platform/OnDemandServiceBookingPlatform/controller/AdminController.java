package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Admin;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Users;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.AdminRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.AdminService;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserService userService;
    @Autowired
    private AdminRepository adminRepository;

    @PostMapping("/register")
    public Admin register(@RequestBody Admin admin) {
        return userService.register(admin, adminRepository);
    }

    @PostMapping("/login")
    public String login(@RequestBody Admin admin) {
        return userService.verify(admin, adminRepository);
    }


}
