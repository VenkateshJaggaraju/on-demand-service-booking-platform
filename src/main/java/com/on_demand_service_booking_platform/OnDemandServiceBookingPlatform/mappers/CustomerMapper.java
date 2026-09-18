package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CustomerLoginRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CustomerRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CustomerResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    // DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookings", ignore = true)
    Customer toEntity(CustomerRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "profile", ignore = true)
    @Mapping(target = "mobileNumber", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "bookings", ignore = true)
    Customer toEntity(CustomerLoginRequestDTO dto);

    // Entity -> safe API response; password is intentionally not a response field.
    CustomerResponseDTO toResponseDTO(Customer customer);
}
