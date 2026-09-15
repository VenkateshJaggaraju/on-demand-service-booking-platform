package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;



import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Services;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceProviderService {

    @Autowired
    private ServiceRepository serviceRepository;


    public List<Services> addService(Services service) {
        serviceRepository.save(service);
        return serviceRepository.findAll();
    }

    public List<Services> getServices() {

        return serviceRepository.findAll();
    }
}
