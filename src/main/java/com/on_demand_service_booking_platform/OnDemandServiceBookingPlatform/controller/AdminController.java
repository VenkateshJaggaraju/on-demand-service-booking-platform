package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.AdminDTO;
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
    private AdminService adminService;

    @PostMapping("/register")
    public AdminDTO register(@RequestBody AdminDTO dto) {
        return adminService.register(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody AdminDTO dto) {
        return adminService.login(dto);
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {
        return adminService.logout(request);
    }


}
