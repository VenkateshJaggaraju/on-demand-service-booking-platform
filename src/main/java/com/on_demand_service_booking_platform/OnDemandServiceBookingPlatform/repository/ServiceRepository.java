package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Services, Long> {
    /* DTO Projection(solving n+1 query problem)
     * — same idea as findAuthorsWithBookCount(), but using
     * LEFT JOIN instead of JOIN so a service with zero bookings still shows
     * up (with bookingCount = 0) instead of being dropped from the result.
     *
     * One single query: the database does the counting via GROUP BY, so no
     * Booking rows are ever loaded into the app just to call .size() on
     * them — this is what actually avoids the N+1, not just batching it.
     */
    @Query("SELECT new com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceResponseDTO(" +
            "s.id, s.name, s.description, s.price, s.icon, s.category, COUNT(b)) " +
            "FROM Services s LEFT JOIN s.bookings b " +
            "GROUP BY s.id, s.name, s.description, s.price, s.icon, s.category")
    List<ServiceResponseDTO> findAllWithBookingCount();
}
