package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRequestDTO {

    private String username;
    private String password;
    private String profile;
    private Long mobileNumber;
    private String email;
}

