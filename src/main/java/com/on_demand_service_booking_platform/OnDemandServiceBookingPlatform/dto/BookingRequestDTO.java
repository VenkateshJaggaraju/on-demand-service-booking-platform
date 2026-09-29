package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequestDTO {

//    private Long customerId;// get customerId from "Authentication" (authenticated) customer
    private Long serviceId;

//    private LocalDate bookingDate;
//    private LocalDate bookingTime;
    //system is generating these two no needed in request dto

    private String address;
//    private String reason;
}
