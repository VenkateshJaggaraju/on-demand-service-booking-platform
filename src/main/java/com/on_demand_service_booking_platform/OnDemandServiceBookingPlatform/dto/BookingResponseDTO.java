package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.BookingStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {

    private Long id;

    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerMobile;

    private String serviceId;
    private String serviceName;
    private String servicePrice;

    private LocalDate bookingDate;
    private LocalTime bookingTime;

    private String address;
    private Long totaAmount;
    private String reason;

    private BookingStatus status;

}
