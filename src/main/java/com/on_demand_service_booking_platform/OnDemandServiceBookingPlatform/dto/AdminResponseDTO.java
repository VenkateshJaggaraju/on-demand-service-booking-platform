package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Safe administrator data returned by the API. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminResponseDTO {

    private Long id;
//    private String token;
    private String username;
    private Role role;
}
