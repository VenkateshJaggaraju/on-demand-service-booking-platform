package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.exceptions;

import lombok.Getter;

@Getter
public class UserExistsException extends RuntimeException{
    String message="User already exists";
}
