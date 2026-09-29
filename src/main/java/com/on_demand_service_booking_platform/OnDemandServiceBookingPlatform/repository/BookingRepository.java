package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Booking;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Customer's bookings
    List<Booking> findByCustomerId(Long customerId);


    boolean existsByServiceIdAndBookingDateAndStatusIn(Long id, LocalDate bookingDate, List<BookingStatus> pending);
}
