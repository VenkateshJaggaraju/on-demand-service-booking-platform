package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CustomerDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Customer;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.CustomerRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.CustomerService;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

   @Autowired
   private CustomerService customerService;

    //    @PostMapping(value = "/register", consumes = "multipart/form-data")
    @PostMapping(value = "/register")
    public CustomerDTO register(@RequestBody CustomerDTO dto) {
        return customerService.register(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody CustomerDTO dto) {
        return customerService.login(dto);
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {
        return customerService.logout(request);
    }

    @GetMapping("/payments")
    public String payment(){
        return "payment api";
    }

    @GetMapping("/services")
    public String services() {
        return "All services are available";
    }

}
