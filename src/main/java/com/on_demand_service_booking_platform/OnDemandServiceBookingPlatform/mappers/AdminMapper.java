package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.AdminRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.AdminResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Admin;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminMapper {

    // Entity <- DTO
    @Mapping(target = "id", ignore = true)
    Admin toEntity(AdminRequestDTO dto);

    // DTO <- Entity
    AdminResponseDTO toResponseDTO(Admin admin);
}
