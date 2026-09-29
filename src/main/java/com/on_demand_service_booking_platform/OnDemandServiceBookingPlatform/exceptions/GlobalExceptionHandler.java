package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.exceptions;

import jakarta.persistence.OptimisticLockException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserExistsException.class)
    public String handler(UserExistsException exception) {
        return exception.getMessage();
    }

    @ExceptionHandler(Exception.class)
    public String handler(Exception exception) {
        return exception.getMessage();
    }

    @ExceptionHandler(OptimisticLockException.class)
    public ResponseEntity<String> handleOptimisticLock(OptimisticLockException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("Booking was modified by another request. Please refresh and try again.");
    }
}
