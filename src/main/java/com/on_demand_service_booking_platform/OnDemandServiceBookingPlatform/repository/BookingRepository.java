package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Booking;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Customer's bookings
    List<Booking> findByCustomerId(Long customerId);

    // Customer's bookings by status
    List<Booking> findByCustomerIdAndStatus(Long customerId, BookingStatus bookingStatus);

    // All bookings for a particular service
    List<Booking> findByServiceId(Long serviceId);

    // Pending bookings for a particular service
    List<Booking> findByServiceIdAndStatus(Long serviceId, BookingStatus status);

    boolean existsByServiceIdAndBookingDateAndStatusIn(Long id, LocalDate bookingDate, List<BookingStatus> pending);

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.customer
        JOIN FETCH b.service
        ORDER BY b.id DESC
        """)
    List<Booking> findAllWithCustomerAndService();
}
