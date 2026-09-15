package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Services, Long> {
}
