package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// What the API returns — no lazy "bookings" collection, just a safe summary

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceResponseDTO {

    private Long id;
    private String name;
    private String description;
    private Integer actualPrice;   // what db having
    private String displayPrice;   // filled in after the query — see ServiceMapper.formatPrice
    private String icon;
    private String category;
    private long bookingCount;
    
    public ServiceResponseDTO(Long id, String name, String description, Integer actualPrice,
                              String icon, String category, long bookingCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.actualPrice = actualPrice;
        this.icon = icon;
        this.category = category;
        this.bookingCount = bookingCount;
    }
}