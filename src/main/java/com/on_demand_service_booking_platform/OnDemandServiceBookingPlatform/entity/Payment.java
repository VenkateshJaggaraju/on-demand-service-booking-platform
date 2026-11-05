package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.PaymentMethod;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.PaymentStatus;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

@Document(collection = "payments")
@CompoundIndex(name = "status_created_idx", def = "{'status': 1, 'createdAt': 1}")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    private String id; // MongoDB ObjectId

    @Indexed
    private Long bookingId;

    @Indexed
    private Long customerId;

    private BigDecimal amount;
    private String currency; // "INR"
    private PaymentMethod method;
    private PaymentStatus status;

    @Indexed(unique = true, sparse = true)
    private String gatewayOrderId;
    private String gatewayPaymentId;

    private Map<String, Object> gatewayResponse; // raw payload, any shape

    private String failureReason; // set by schedulers or gateway failures

    @Version             // MongoDB @version butn't Postgres
    private Long version; // optimistic locking: scheduler vs webhook

    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;

}
/*
 * Enable auditing so the @CreatedDate and @LastModifiedDate fields get filled in,
 * on your main class or a config class: @EnableMongoAuditing
 */