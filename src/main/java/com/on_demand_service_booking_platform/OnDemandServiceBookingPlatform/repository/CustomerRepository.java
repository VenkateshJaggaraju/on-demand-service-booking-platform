package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Admin;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends UserRepository<Customer> {

    Customer findByUsername(String username);
}
