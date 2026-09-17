package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.exceptions;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserExistsException.class)
    public String handler(UserExistsException exception){
        return exception.getMessage();
    }
}
