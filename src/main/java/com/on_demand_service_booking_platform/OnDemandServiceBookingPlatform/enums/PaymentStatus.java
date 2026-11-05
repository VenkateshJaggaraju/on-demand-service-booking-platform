package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums;

public enum PaymentStatus {

    INITIATED,
    SUCCESS,
    FAILED,
    EXPIRED, // set by scheduler: never completed
    REFUND_PENDING, // set by scheduler: paid, but booking was cancelled or rejected
    REFUNDED
}
