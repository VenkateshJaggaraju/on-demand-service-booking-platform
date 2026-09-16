package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers;


import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Services;

@Mapper(componentModel = "spring")
public interface ServiceMapper {

    // id is DB-generated, bookings isn't part of a create request.
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookings", ignore = true)
    Services toEntity(ServiceRequestDTO dto);

    /* NOTE: no mapServicesToDTOList(List<Services>) here. Calling
     * s.getBookings().size() per entity was the N+1: findAll() (1 query)
     * + one lazy-load query per Services row. bookingCount now arrives
     * pre-aggregated from ServiceRepository#findAllWithBookingCount()
     * (COUNT + GROUP BY, one query total).
     */

    // Still useful for a single-entity path, e.g. right after saving one
    // Services row where you already have it in hand.
    @Mapping(source = "service.id", target = "id")
    @Mapping(source = "service.name", target = "name")
    @Mapping(source = "service.description", target = "description")
    @Mapping(source = "service.price", target = "actualPrice")
    @Mapping(source = "service.price", target = "displayPrice", qualifiedByName = "formatPrice")
    @Mapping(source = "service.icon", target = "icon")
    @Mapping(source = "service.category", target = "category")
    @Mapping(source = "bookingCount", target = "bookingCount")
    ServiceResponseDTO mapServiceToDTO(Services service, long bookingCount);

    // Fills in displayPrice for rows that came from the JPQL projection,
    // which can't call this @Named method itself.
    // show 100Rs more to Customer
    default List<ServiceResponseDTO> withDisplayPrice(List<ServiceResponseDTO> dtos) {
        dtos.forEach(dto -> dto.setDisplayPrice(formatPrice(dto.getActualPrice()+100)));
        return dtos;
    }

    @Named("formatPrice")
    static String formatPrice(Integer price) {
        return price == null ? "₹0" : "₹" + price;
    }
}