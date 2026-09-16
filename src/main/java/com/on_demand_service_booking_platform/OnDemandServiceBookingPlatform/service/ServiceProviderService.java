package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;



import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers.ServiceMapper;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Services;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceProviderService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ServiceMapper serviceMapper;

    public ServiceResponseDTO addService(ServiceRequestDTO requestDTO) {
        Services service = serviceMapper.toEntity(requestDTO);
        //here ServiceProvider is just adding the services but how he can get booking count at this time
        return serviceMapper.mapServiceToDTO(serviceRepository.save(service), 0L);
    }


    // services may well have real bookings by now.
    public List<ServiceResponseDTO> getServices() {
        return serviceMapper.withDisplayPrice(serviceRepository.findAllWithBookingCount());
    }
}
