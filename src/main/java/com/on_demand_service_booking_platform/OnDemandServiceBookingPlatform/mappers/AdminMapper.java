package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.AdminDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Admin;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminMapper {

    // DTO -> Entity
    @Mapping(target = "id", ignore = true)
    Admin toEntity(AdminDTO dto);

    // Entity -> DTO
//    @Mapping(target = "password", ignore = true)
    AdminDTO toDTO(Admin admin);
}