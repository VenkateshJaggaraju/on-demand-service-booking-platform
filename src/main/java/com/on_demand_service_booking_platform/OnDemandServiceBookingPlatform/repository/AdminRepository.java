package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AdminRepository extends UserRepository<Admin> {

    Admin findByUsername(String username);
}
