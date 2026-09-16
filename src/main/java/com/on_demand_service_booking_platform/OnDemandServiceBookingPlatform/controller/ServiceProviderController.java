package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;


import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.ServiceProvider;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.ServiceProviderRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.ServiceProviderService;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service-provider")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceProviderController {

    @Autowired
    private UserService userService;
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private ServiceProviderService serviceProviderService;

    @PostMapping("/register")
    public ServiceProvider register(@RequestBody ServiceProvider serviceProvider) {
        return userService.register(serviceProvider, serviceProviderRepository);
    }

    @PostMapping("/login")
    public String login(@RequestBody ServiceProvider serviceProvider) {
        return userService.verify(serviceProvider, serviceProviderRepository);
    }

    @PostMapping("/service")
    public ServiceResponseDTO addService(@RequestBody ServiceRequestDTO requestDTO) {
        return serviceProviderService.addService(requestDTO);
    }

    @GetMapping("/services")
    public List<ServiceResponseDTO> getServices() {
        return serviceProviderService.getServices();
    }

}
