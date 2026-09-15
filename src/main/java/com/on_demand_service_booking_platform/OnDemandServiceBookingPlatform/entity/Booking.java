package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;//customer_id is the foreign key in this table

    @ManyToOne
    @JoinColumn(name = "services_id", nullable = false)
    private Services service;//services_id is the foreign key in this table

    private LocalDate bookingDate;

    private LocalDate bookingTime;

    private String address;

    private Double totalAmount;

    @Enumerated(EnumType.STRING)//without this JPA can store these indexes
    @Column(nullable = false)
    private BookingStatus status;
}
