package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.BookingRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.BookingResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookingMapper {


    // Entity <- DTO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookingDate", ignore = true)
    @Mapping(target = "bookingTime", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "service", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "reason", ignore = true)
    Booking toEntity(BookingRequestDTO request);
    //set above last 4 in BookingService


    // DTO <- Entity
    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", source = "customer.username")
    @Mapping(target = "customerEmail", source = "customer.email")
    @Mapping(target = "customerMobile", source = "customer.mobileNumber")
    @Mapping(target = "serviceId", source = "service.id")
    @Mapping(target = "serviceName", source = "service.name")
    @Mapping(target = "servicePrice", source = "service.price")
    BookingResponseDTO toResponseDTO(Booking booking);

    List<BookingResponseDTO> toResponseDTOList(List<Booking> bookings);
}
