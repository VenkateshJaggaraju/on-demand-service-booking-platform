package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface UserRepository<T extends Users> extends JpaRepository<T, Long> {

    T findByUsername(String username);
}
//UserRepository implements <-- {AdminRepository, CustomerRepository, ServiceProviderRepository}