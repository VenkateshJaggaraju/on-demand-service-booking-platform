package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceProviderDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.ServiceProvider;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ServiceProviderMapper {

    // DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "profile", ignore = true)
    ServiceProvider toEntity(ServiceProviderDTO dto);

    // Entity -> DTO
//    @Mapping(target = "password", ignore = true)
    @Mapping(target = "profile", ignore = true)
    ServiceProviderDTO toDTO(ServiceProvider serviceProvider);
}