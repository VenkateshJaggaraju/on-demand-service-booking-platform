package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Admin;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Customer;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.ServiceProvider;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.Role;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.AdminRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.CustomerRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Provider;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Admin admin = adminRepository.findByUsername(username);
        if (admin != null) {
            return new UserPrincipal(admin.getUsername(), admin.getPassword(), Role.ADMIN);
        }

        Customer customer = customerRepository.findByUsername(username);
        if (customer != null) {
            return new UserPrincipal(customer.getUsername(), customer.getPassword(), Role.CUSTOMER);
        }

        ServiceProvider provider = serviceProviderRepository.findByUsername(username);
        if (provider != null) {
            return new UserPrincipal(provider.getUsername(), provider.getPassword(), Role.SERVICEPROVIDER);
        }

        throw new UsernameNotFoundException("User not found: " + username);
    }
}
