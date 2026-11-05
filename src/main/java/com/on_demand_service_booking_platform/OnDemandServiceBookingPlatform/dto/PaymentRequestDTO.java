package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.PaymentMethod;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequestDTO {

    Long bookingId;
    PaymentMethod method;
}
