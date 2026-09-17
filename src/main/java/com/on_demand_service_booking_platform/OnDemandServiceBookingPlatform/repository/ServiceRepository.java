package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServiceRepository extends JpaRepository<Services, Long> {

    /* Single flexible search: name (partial, case-insensitive), minPrice,
     * and maxPrice are all optional — pass null for any filter you don't
     * want applied. The "(:param IS NULL OR ...)" pattern lets one JPQL
     * query cover "no filters" (all services), "name only", "price range
     * only", or both together, instead of maintaining a separate method
     * per filter combination.
     *
     * maxPrice being null means "no upper bound" — that's how the ">1000"
     * band works: minPrice=1001, maxPrice=null.
     *
     * countQuery is required (rather than Spring Data auto-deriving one)
     * because the main query uses GROUP BY: an auto-derived count would
     * wrap COUNT(*) around a query that already returns one row per
     * group, which isn't a valid scalar count.
     */
    @Query(""" 
            SELECT new com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.ServiceResponseDTO( 
                        s.id, s.name, s.description, s.price, s.icon, s.category, 
                        COUNT(b.id) 
                       ) 
            FROM Services s 
            LEFT JOIN s.bookings b 
            WHERE (:name IS NULL OR s.name ILIKE CONCAT('%', :name, '%')) AND 
                  (:minPrice IS NULL OR s.price >= :minPrice) AND 
                  (:maxPrice IS NULL OR s.price <= :maxPrice) 
            GROUP BY s.id, s.name, s.description, s.price, s.icon, s.category """)
    Page<ServiceResponseDTO> searchServices( @Param("name") String name,
                                             @Param("minPrice") Integer minPrice,
                                             @Param("maxPrice") Integer maxPrice,
                                             Pageable pageable
    );
}