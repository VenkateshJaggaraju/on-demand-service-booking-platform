package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.PaymentRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.PaymentResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Payment;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "bookingId", source = "bookingId")
    @Mapping(target = "method", source = "method")
    Payment toEntity(PaymentRequestDTO request);

    PaymentResponseDTO toResponse(Payment payment);

    List<PaymentResponseDTO> toResponseList(List<Payment> payments);
}
