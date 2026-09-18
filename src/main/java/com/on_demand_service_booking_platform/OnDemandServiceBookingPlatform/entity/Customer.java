package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.Role;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.List;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "customer")
@AttributeOverrides({
        @AttributeOverride(
                name = "username",
                column = @Column(name = "customer_name", nullable = false)
        ),
        @AttributeOverride(
                name = "password",
                column = @Column(name = "customer_password", nullable = false)
        )
})
public class Customer extends Users{



    @Column(name = "customer_profile", nullable = true)
    private byte[] profile;//get his image in bytes(BLOB) and max. size of image 4GB

    @Column(name = "customer_phone_number", unique = true, nullable = false)
    private Long mobileNumber;
    @Column(name = "customer_mail", unique = true, nullable = false)
    private String email;

    @OneToMany(mappedBy = "customer")
    private List<Booking> bookings;

    @Override
    public Role getRole() {
        return Role.CUSTOMER;
    }
}
