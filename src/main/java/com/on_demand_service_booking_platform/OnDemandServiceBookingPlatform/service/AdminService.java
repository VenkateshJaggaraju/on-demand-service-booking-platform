package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.AdminRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.AdminResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Admin;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers.AdminMapper;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.AdminRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminMapper adminMapper;

    public AdminResponseDTO register(AdminRequestDTO dto) {

        Admin admin = adminMapper.toEntity(dto);
        Admin savedAdmin = userService.register(admin, adminRepository);
        return adminMapper.toResponseDTO(savedAdmin);
    }

    public String login(AdminRequestDTO dto) {

        Admin admin = adminMapper.toEntity(dto);
        return userService.verify(admin, adminRepository);
    }

    public String logout(HttpServletRequest request) {
        return userService.logout(request);
    }
}
