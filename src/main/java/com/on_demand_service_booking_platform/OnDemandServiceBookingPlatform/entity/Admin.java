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
@Table(name = "admin")
@AttributeOverrides({
        @AttributeOverride(
                name = "username",
                column = @Column(name = "admin_name", nullable = false)
        ),
        @AttributeOverride(
                name = "password",
                column = @Column(name = "admin_password", nullable = false)
        )
})
public class Admin extends Users{

    @Override
    public Role getRole() {
        return Role.ADMIN;
    }


}
