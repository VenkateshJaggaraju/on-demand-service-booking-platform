package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "service_provider")
@AttributeOverrides({
        @AttributeOverride(
                name = "username",
                column = @Column(name = "service_provider_name", nullable = false)
        ),
        @AttributeOverride(
                name = "password",
                column = @Column(name = "service_provider_password", nullable = false)
        )
})
public class ServiceProvider extends Users {

    @Column(name = "service_provider_profile", nullable = true)
    private byte[] profile;//get his image in bytes(BLOB) and max. size of image 4GB


    @Column(name = "service_provider_phone_number", unique = true, nullable = false)
    private Long mobileNumber;
    @Column(name = "service_provider_mail", unique = true, nullable = false)
    private String email;

    @Override
    public Role getRole() {
        return Role.SERVICEPROVIDER;
    }

}
