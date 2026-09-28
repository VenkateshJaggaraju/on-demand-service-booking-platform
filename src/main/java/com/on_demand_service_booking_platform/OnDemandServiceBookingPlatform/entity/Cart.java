package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;

    @ManyToOne
    @JoinColumn(name = "services_id")
    private Services service;//here it is foreign key
    //When you call cart.getService(), it loads the full Services entity through that key.
}
