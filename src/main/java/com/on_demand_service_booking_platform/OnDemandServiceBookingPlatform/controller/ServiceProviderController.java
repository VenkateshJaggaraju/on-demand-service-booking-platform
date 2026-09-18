package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;


import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.*;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.ServiceProviderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/service-provider")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceProviderController {


    @Autowired
    private ServiceProviderService serviceProviderService;

    @PostMapping("/register")
    public ServiceProviderResponseDTO register(@RequestBody ServiceProviderRequestDTO dto) {
        return serviceProviderService.register(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody ServiceProviderLoginRequestDTO dto) {
        return serviceProviderService.login(dto);
    }

    @PostMapping("/service")
    public ServiceResponseDTO addService(@RequestBody ServiceRequestDTO requestDTO) {
        return serviceProviderService.addService(requestDTO);
    }

    // One endpoint covers plain listing, name search, price-range filter,
    // and any combination of the two — pass only the params you need.
    // "page" is 1-indexed here for a friendlier frontend API (page=1 is
    // the first page); converted to Spring Data's 0-indexed convention
    // before calling the service layer.
    //
    // Examples:
    //   GET /service-provider/services?page=1
    //   GET /service-provider/services?name=clean&page=1
    //   GET /service-provider/services?minPrice=200&maxPrice=500&page=1
    //   GET /service-provider/services?name=repair&minPrice=500&page=1
    @GetMapping("/services")
    public Page<ServiceResponseDTO> getServices(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(defaultValue = "1") int page) {
        int zeroIndexedPage = Math.max(page - 1, 0);
        return serviceProviderService.searchServices(name, minPrice, maxPrice, zeroIndexedPage);
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {
        return serviceProviderService.logout(request);
    }

}