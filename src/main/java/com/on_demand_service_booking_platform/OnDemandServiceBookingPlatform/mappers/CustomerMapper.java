package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CustomerDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    // DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookings", ignore = true)
    @Mapping(target = "profile", ignore = true)
    Customer toEntity(CustomerDTO dto);

    // Entity -> DTO
//    @Mapping(target = "password", ignore = true)
    @Mapping(target = "profile", ignore = true)
    CustomerDTO toDTO(Customer customer);
}
