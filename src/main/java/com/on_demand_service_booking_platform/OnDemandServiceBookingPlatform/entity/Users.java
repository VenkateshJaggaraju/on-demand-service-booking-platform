package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.jspecify.annotations.Nullable;

@MappedSuperclass
@Getter
@Setter
public abstract class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    public abstract Role getRole();

    /* Here UNIQUE contraint on password makes no sense because
     * once passwords are hashed, if two users ever coincidentally shared a password pre-hash,
     * you'd get a constraint violation on registration
     */
}
