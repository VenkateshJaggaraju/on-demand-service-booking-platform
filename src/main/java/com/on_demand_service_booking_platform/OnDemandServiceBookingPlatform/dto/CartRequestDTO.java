package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartRequestDTO {

    private Long customerId;
    private Long serviceId;
}
