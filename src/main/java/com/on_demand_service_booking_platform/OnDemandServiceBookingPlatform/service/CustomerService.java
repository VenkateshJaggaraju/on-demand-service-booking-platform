package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CustomerLoginRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CustomerRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CustomerResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Customer;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers.CustomerMapper;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.CustomerRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    @Autowired
    private UserService userService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerMapper customerMapper;

    public CustomerResponseDTO register(CustomerRequestDTO dto) {
        Customer customer = customerMapper.toEntity(dto);
        Customer savedCustomer = userService.register(customer, customerRepository);

        return customerMapper.toResponseDTO(savedCustomer);
    }

    public String login(CustomerLoginRequestDTO dto) {

        Customer customer = customerMapper.toEntity(dto);
        return userService.verify(customer, customerRepository);
    }

    public String logout(HttpServletRequest request) {
        return userService.logout(request);
    }
}
