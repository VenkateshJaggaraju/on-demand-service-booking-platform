package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponseDTO {

    private Long cartItemId;
    private ServiceResponseDTO service;
}
