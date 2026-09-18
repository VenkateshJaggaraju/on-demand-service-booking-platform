package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Input accepted when an administrator registers or signs in. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminRequestDTO {

    private String username;
    private String password;
}
