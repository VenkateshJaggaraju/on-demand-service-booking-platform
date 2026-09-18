package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Credentials accepted only by the customer login endpoint. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerLoginRequestDTO {

    private String username;
    private String password;
}
