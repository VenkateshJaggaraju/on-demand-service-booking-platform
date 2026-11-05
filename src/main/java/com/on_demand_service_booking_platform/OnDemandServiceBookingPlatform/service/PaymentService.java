package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.PaymentRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.PaymentResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Booking;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Customer;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Payment;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.BookingStatus;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.PaymentStatus;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers.PaymentMapper;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.BookingRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.CustomerRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.PaymentRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PaymentMapper paymentMapper;

    @SneakyThrows
    public ResponseEntity<PaymentResponseDTO> pay(PaymentRequestDTO request, Authentication authentication) {

        if (request.getBookingId() == null || request.getMethod() == null) {
            throw new IllegalArgumentException("bookingId and method are required");
        }

        Customer customer=customerRepository.findByUsername(authentication.getName());

        if(customer == null){
            throw new RuntimeException("Customer not found");
        }

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if(!booking.getCustomer().getId().equals(customer.getId())){
            throw new AccessDeniedException("Not your booking");
        }

        if(booking.getStatus() != BookingStatus.CONFIRMED){
            throw new IllegalArgumentException("Booking is not confirmed");
        }

        if(paymentRepository.existsByBookingIdAndStatus(booking.getId(), PaymentStatus.SUCCESS)){
            throw new IllegalArgumentException("Already paid");
        }

        Payment payment = paymentMapper.toEntity(request); // bookingId + method
        payment.setCustomerId(customer.getId());
        payment.setAmount(BigDecimal.valueOf(booking.getTotalAmount())); // server-side amount
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.INITIATED);

        // TODO: create gateway order -> set gatewayOrderId.
        // Status then moves to SUCCESS/FAILED via the gateway webhook.
        // The expiry scheduler cleans up anything that stays INITIATED.

        PaymentResponseDTO response = paymentMapper.toResponse(paymentRepository.save(payment));

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<List<PaymentResponseDTO>> myPayments(Authentication authentication) {
        Customer customer = customerRepository.findByUsername(authentication.getName());

        if(customer == null){
            throw new RuntimeException("Customer not found");
        }

        List<PaymentResponseDTO> response = paymentMapper.toResponseList(paymentRepository.findByCustomerId(customer.getId()));

        return ResponseEntity.ok(response);
    }
}
