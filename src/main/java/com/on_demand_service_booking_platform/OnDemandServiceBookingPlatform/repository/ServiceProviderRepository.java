package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Admin;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.security.Provider;


public interface ServiceProviderRepository extends UserRepository<ServiceProvider>{

    ServiceProvider findByUsername(String username);
}
