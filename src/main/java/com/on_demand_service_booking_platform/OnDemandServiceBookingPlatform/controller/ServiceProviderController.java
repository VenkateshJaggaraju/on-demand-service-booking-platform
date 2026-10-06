package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;


import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.*;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.BookingStatus;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.BookingService;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.ServiceProviderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service-provider")
//@CrossOrigin(origins = "http://localhost:5173")
public class ServiceProviderController {


    @Autowired
    private ServiceProviderService serviceProviderService;

    @Autowired
    private BookingService bookingService;

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

//    @PostMapping("/cart")
//    public List<ServiceResponseDTO>

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

    @GetMapping("/all-services")
    public ResponseEntity<List<ServiceResponseDTO>> getAllCustomers(){
        return serviceProviderService.getAllServices();
    }

    @GetMapping("/all-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/booking")
    public ResponseEntity<List<BookingResponseDTO>> getServiceBookings(@RequestParam("id") Long serviceId){
        return bookingService.getServiceBookings(serviceId);
    }

    @GetMapping("/booking/service/{id}/pending")
    public ResponseEntity<List<BookingResponseDTO>> getPendingBookings(@PathVariable("id") Long serviceId){
        return bookingService.getPendingBookings(serviceId);
    }

    @PatchMapping("booking/{id}/status")
    public ResponseEntity<BookingResponseDTO> updateStatus(@PathVariable("id") Long bookingId, @RequestParam String reason,@RequestParam BookingStatus status){
        return bookingService.updateStatus(bookingId, reason, status);
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {
        return serviceProviderService.logout(request);
    }

}