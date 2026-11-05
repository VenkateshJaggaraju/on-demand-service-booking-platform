package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.PaymentMethod;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {

    String id;
    Long bookingId;
    BigDecimal amount;
    String currency;
    PaymentMethod method;
    PaymentStatus status;
    String gatewayOrderId;
    String failureReason;
    Instant createdAt;
}
