package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.AdminRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.AdminResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public AdminResponseDTO register(@RequestBody AdminRequestDTO dto) {
        return adminService.register(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody AdminRequestDTO dto) {
        return adminService.login(dto);
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {
        return adminService.logout(request);
    }


}
