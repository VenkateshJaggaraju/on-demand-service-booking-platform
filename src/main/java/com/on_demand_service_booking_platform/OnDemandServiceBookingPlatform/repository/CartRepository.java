package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query("SELECT COUNT(c) > 0 FROM Cart c WHERE c.customerId = :customerId AND c.service.id = :serviceId")
    boolean existsByCustomerIdAndServiceId(@Param("customerId") Long customerId,
                                           @Param("serviceId") Long serviceId);

    @Query("SELECT c FROM Cart c JOIN FETCH c.service WHERE c.customerId = :customerId")
    List<Cart> findByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT c FROM Cart c JOIN FETCH c.service WHERE c.id = :cartItemId AND c.customerId = :customerId")
    Cart findByCartIdAndCustomerId(@Param("cartItemId") Long cartItemId,
                                   @Param("customerId") Long customerId);
}
