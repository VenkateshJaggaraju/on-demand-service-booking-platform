package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Customer;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.CustomerRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    @Autowired
    private UserService userService;
    @Autowired
    private CustomerRepository customerRepository;

    //    @PostMapping(value = "/register", consumes = "multipart/form-data")
    @PostMapping(value = "/register")
    public Customer register(@RequestBody Customer customer) {
        return userService.register(customer, customerRepository);
    }

    @PostMapping("/login")
    public String login(@RequestBody Customer customer) {
        return userService.verify(customer, customerRepository);
    }
}
