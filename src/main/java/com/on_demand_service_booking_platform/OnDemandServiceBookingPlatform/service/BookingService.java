package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.BookingRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.BookingResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Booking;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Customer;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Services;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.BookingStatus;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers.BookingMapper;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.BookingRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.CustomerRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.ServiceRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingMapper bookingMapper;

    @Transactional
    public ResponseEntity<BookingResponseDTO> createBooking(BookingRequestDTO request, Authentication authentication) {

        Long customerId=getCustomerId(authentication);

        Customer customer=customerRepository.findById(customerId)
                .orElseThrow(()-> new RuntimeException("customer not found"));

        Services service=serviceRepository.findById(request.getServiceId())
                .orElseThrow(()-> new RuntimeException("Service not found"));

        // setup current zones
        LocalDate bookingDate = LocalDate.now();
        LocalTime bookingTime= LocalTime.now();

        boolean alreadyBooked = bookingRepository.existsByServiceIdAndBookingDateAndStatusIn(
                service.getId(),
                bookingDate,
                List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)   // use your enum's actual values
        );

        if(alreadyBooked){
            throw new RuntimeException("This service is already booked by the "+customer.getUsername());
        }

        Booking booking=bookingMapper.toEntity(request);

        booking.setCustomer(customer);
        booking.setService(service);
        booking.setBookingDate(bookingDate);
        booking.setBookingTime(bookingTime);
        booking.setTotalAmount(service.getPrice()+300.0);// SellingPrice from UI
        booking.setAddress(request.getAddress());
        booking.setReason("you are started booking now");
        booking.setStatus(BookingStatus.PENDING);

        BookingResponseDTO response = bookingMapper.toResponseDTO(bookingRepository.save(booking));

        return ResponseEntity.status(200).body(response);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAllWithCustomerAndService();
        return ResponseEntity.ok(bookingMapper.toResponseDTOList(bookings));
    }

    public ResponseEntity<List<BookingResponseDTO>> getCustomerBookings(Authentication authentication) {
        Long customerId=getCustomerId(authentication);

        List<BookingResponseDTO> response = bookingRepository.findByCustomerId(customerId)
                .stream()
                .map(bookingMapper::toResponseDTO)
                .toList();
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<BookingResponseDTO> getCustomerBooking(Long bookingId, Authentication authentication) {
        Long customerId=getCustomerId(authentication);

        Booking booking=bookingRepository.findById(bookingId)
                .orElseThrow(()-> new RuntimeException("Booking not found"));

        if(!booking.getCustomer().getId().equals(customerId)){
            throw new RuntimeException("You are not allowed to access this booking");
        }

        BookingResponseDTO response=bookingMapper.toResponseDTO(booking);

        return ResponseEntity.ok(response);

    }

    public ResponseEntity<List<BookingResponseDTO>> getServiceBookings(Long serviceId) {
        List<BookingResponseDTO> response=bookingRepository.findByServiceId(serviceId)
                                                            .stream()
                                                            .map(bookingMapper::toResponseDTO)
                                                            .toList();

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<List<BookingResponseDTO>> getPendingBookings(Long serviceId) {
        List<BookingResponseDTO> response = bookingRepository.findByServiceIdAndStatus(serviceId, BookingStatus.PENDING)
                .stream()
                .map(bookingMapper::toResponseDTO)
                .toList();

        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<BookingResponseDTO> updateStatus(Long bookingId, String reason, BookingStatus status) {
        Booking booking=bookingRepository.findById(bookingId)
                .orElseThrow(()-> new RuntimeException("Booking not found"));

        booking.setReason(reason);
        booking.setStatus(status);

        BookingResponseDTO response = bookingMapper.toResponseDTO(bookingRepository.save(booking));

        return ResponseEntity.ok(response);
    }

    private Long getCustomerId(Authentication authentication) {
        Customer customer=customerRepository.findByUsername(authentication.getName());
        return customer.getId();
    }

}
