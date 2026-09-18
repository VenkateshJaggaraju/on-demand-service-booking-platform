package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;



import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.*;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.ServiceProvider;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers.ServiceMapper;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Services;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.mappers.ServiceProviderMapper;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.ServiceProviderRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.ServiceRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ServiceProviderService {

    // 3x3 grid on the frontend — keep this as the single source of truth
    // for page size so nothing can drift out of sync.
    private static final int PAGE_SIZE = 9;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserService userService;
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private ServiceMapper serviceMapper;
    @Autowired
    private ServiceProviderMapper serviceProviderMapper;

    public ServiceResponseDTO addService(ServiceRequestDTO requestDTO) {
        Services service = serviceMapper.toEntity(requestDTO);
        //here ServiceProvider is just adding the services but how he can get booking count at this time
        return serviceMapper.mapServiceToDTO(serviceRepository.save(service), 0L);
    }

    // Now services may've booking count
    // page is zero-indexed (page 0 = first page), matching Spring Data's
    // own convention for Pageable/PageRequest. name/minPrice/maxPrice may
    // all be null — "no filter applied" for whichever ones are omitted.

    public Page<ServiceResponseDTO> searchServices(
            String name,
            Integer minPrice,
            Integer maxPrice,
            int page) {

        if (name == null) {
            name = "";
        }

        name = name.trim();

        Page<ServiceResponseDTO> result =
                serviceRepository.searchServices(
                        name,
                        minPrice,
                        maxPrice,
                        PageRequest.of(page, PAGE_SIZE)
                );

        serviceMapper.withDisplayPrice(result.getContent());

        return result;
    }

    public ServiceProviderResponseDTO register(ServiceProviderRequestDTO dto) {
        ServiceProvider serviceProvider = serviceProviderMapper.toEntity(dto);

        ServiceProvider savedServiceProvider =
                userService.register(
                        serviceProvider,
                        serviceProviderRepository
                );

        return serviceProviderMapper.toResponseDTO(savedServiceProvider);
    }

    public String login(ServiceProviderLoginRequestDTO dto) {
        ServiceProvider serviceProvider = serviceProviderMapper.toEntity(dto);

        return userService.verify(
                serviceProvider,
                serviceProviderRepository
        );
    }

    public String logout(HttpServletRequest request) {
        return userService.logout(request);
    }
}