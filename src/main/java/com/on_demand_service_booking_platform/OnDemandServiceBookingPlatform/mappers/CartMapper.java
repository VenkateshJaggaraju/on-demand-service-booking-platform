package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CartItemResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CartRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Cart;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Services;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "service", ignore = true)   // set manually in the service layer
    Cart toEntity(CartRequestDTO dto);

    @Mapping(source = "id", target = "cartItemId")
    CartItemResponseDTO toResponseDTO(Cart cart);

    // MapStruct uses this automatically for Cart.service -> CartItemResponseDTO.service
    @Mapping(source = "price", target = "actualPrice")
    @Mapping(target = "displayPrice",
            expression = "java(service.getPrice() == null ? \"₹0\" : \"₹\" + (service.getPrice() + 500))")
    @Mapping(target = "bookingCount", ignore = true)
    ServiceResponseDTO toServiceDTO(Services service);
}
