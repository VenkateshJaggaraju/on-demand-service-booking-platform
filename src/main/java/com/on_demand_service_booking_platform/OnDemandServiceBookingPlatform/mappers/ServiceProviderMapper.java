package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.*;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Customer;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.ServiceProvider;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ServiceProviderMapper {

    // Entity <- DTO
    @Mapping(target = "id", ignore = true)
    ServiceProvider toEntity(ServiceProviderRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "profile", ignore = true)
    @Mapping(target = "mobileNumber", ignore = true)
    @Mapping(target = "email", ignore = true)
    ServiceProvider toEntity(ServiceProviderLoginRequestDTO dto);

    // Entity -> safe API response; password is intentionally not a response field.
    ServiceProviderResponseDTO toResponseDTO(ServiceProvider serviceProvider);
}