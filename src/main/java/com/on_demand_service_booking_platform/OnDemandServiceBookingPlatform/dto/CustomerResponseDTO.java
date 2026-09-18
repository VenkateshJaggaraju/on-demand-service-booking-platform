package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponseDTO {

    private Long id;
    private String username;
    private byte[] profile;
    private Long mobileNumber;
    private String email;
    private Role role;
}
