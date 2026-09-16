package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// What a service provider sends to create/update a service
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequestDTO {

    private String name;
    private String description;
    private Integer price;
    private String icon;
    private String category;
}
