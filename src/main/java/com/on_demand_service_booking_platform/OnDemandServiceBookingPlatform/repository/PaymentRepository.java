package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Payment;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.PaymentStatus;
import org.hibernate.internal.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByCustomerId(Long customerId);
    List<Payment> findByBookingId(Long bookingId);
    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);
    boolean existsByBookingIdAndStatus(Long bookingId, PaymentStatus status);

    // used by schedulers
    List<Payment> findByStatusAndCreatedAtBefore(PaymentStatus status, Instant before);
    List<Payment> findByStatusAndCreatedAtAfter(PaymentStatus status, Instant after);
}
