package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.*;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Cart;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Customer;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Services;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers.CartMapper;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers.CustomerMapper;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.CartRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.CustomerRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.ServiceRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private UserService userService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private CartMapper cartMapper;

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

    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {
        List<CustomerResponseDTO> response = customerRepository.findAll()
                                                                .stream()
                                                                .map(customerMapper::toResponseDTO)
                                                                .toList();

        return ResponseEntity.ok(response);
    }

    public CartItemResponseDTO addToCart(CartRequestDTO dto) {

        if(cartRepository.existsByCustomerIdAndServiceId(dto.getCustomerId(), dto.getServiceId())){
            throw new IllegalArgumentException("service already available in cart");
        }

        Services service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new IllegalArgumentException("service not found"));

//        Cart cart=Cart.builder()
//                .customerId(dto.getCustomerId())
//                .service(service)
//                .build();

        Cart cart=cartMapper.toEntity(dto);
        cart.setService(service);

        return cartMapper.toResponseDTO(cartRepository.save(cart));
    }

    public List<CartItemResponseDTO> getCartItems(Long customerId) {
        return cartRepository.findByCustomerId(customerId)
                            .stream()
                            .map(cartMapper::toResponseDTO)
                            .toList();

        /*
         * map(cartMapper::toResponseDTO)
         * is equivalent to
         * map(cart -> cartMapper.toResponseDTO(cart))
         *
         */
    }

    @Transactional
    public CartItemResponseDTO removeFromCart(Long cartItemId, Long customerId) {

        Cart cart=cartRepository.findByCartIdAndCustomerId(cartItemId, customerId);

        if(cart== null){
             throw new IllegalArgumentException("cart item not found");
        }

        CartItemResponseDTO removed = cartMapper.toResponseDTO(cart);
        cartRepository.delete(cart);
        return ResponseEntity.status(200).body(removed).getBody();
    }
}
