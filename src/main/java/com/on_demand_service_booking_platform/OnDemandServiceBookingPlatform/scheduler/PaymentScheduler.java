package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.scheduler;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Booking;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.entity.Payment;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.BookingStatus;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.enums.PaymentStatus;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.BookingRepository;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.repository.PaymentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
public class PaymentScheduler {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Value("${payment.scheduler.expiry-minutes:15}")
    private Long expiryMinutes;

    @Value("${payment.scheduler.reconcile-days:30}")
    private Long reconcileDays;

    /**
     * Marks payments stuck in INITIATED for too long as EXPIRED.
     */
    @Scheduled(fixedDelayString = "${payment.scheduler.expire-delay-ms:300000}") // every 5 min
    public void expireStalePayments() {
//        At start-up, then every 5 min	INITIATED payments older than 15 min, which become EXPIRED
//        log.info("expireStalePayments running");
        System.err.println("expireStalePayments running");
        Instant cutoff = Instant.now().minus(expiryMinutes, ChronoUnit.MINUTES);
        List<Payment> stale = paymentRepository.findByStatusAndCreatedAtBefore(PaymentStatus.INITIATED, cutoff);

        if (stale.isEmpty()) return;

        for (Payment payment : stale) {
            payment.setStatus(PaymentStatus.EXPIRED);
            payment.setFailureReason("No payment confirmation within "+expiryMinutes+" minutes");
        }

        saveSafely(stale);
        log.info("Expired {} stale payments ", stale.size());
    }

    /** Flags paid payments whose booking was later cancelled or rejected for refund. */
    @Scheduled(cron = "${payment.scheduler.reconcile-cron:0 0 * * * *}") // top of every hour
    public void flagRefundsForCancelledBookings(){
//        Every hour at :00	SUCCESS payments with a cancelled/rejected booking, which become REFUND_PENDING
//        log.info("flagRefundsForCancelledBookings running");
        System.err.println("flagRefundsForCancelledBookings running");
        Instant since = Instant.now().minus(reconcileDays, ChronoUnit.DAYS);
        List<Payment> paid = paymentRepository.findByStatusAndCreatedAtAfter(PaymentStatus.SUCCESS, since);

        if(paid.isEmpty()) return;

        List<Long> bookingIds = paid.stream().map(Payment::getBookingId).distinct().toList();
        Set<Long> dead = bookingRepository.findAllById(bookingIds).stream()
                .filter(booking -> booking.getStatus() == BookingStatus.CANCELLED
                        || booking.getStatus() == BookingStatus.REJECTED
                ).map(Booking::getId)
                .collect(Collectors.toSet());

        List<Payment> toRefund = paid.stream()
                .filter(payment -> dead.contains(payment.getBookingId()))
                .peek(payment -> {
                    payment.setStatus(PaymentStatus.REFUND_PENDING);
                    payment.setFailureReason("Booking cancelled or rejected after payment");
                }).toList();

        if(!toRefund.isEmpty()){
            saveSafely(toRefund);
            log.info("Flagged {} payments as REFUND_PENDING", toRefund.size());
        }
    }


    // A webhook may update the same payment concurrently; skip that one and retry next run
    private void saveSafely(List<Payment> payments) {
        for(Payment payment : payments){
            try {
                paymentRepository.save(payment);
            }catch (OptimisticLockingFailureException exception){
                log.warn("Payment {} changed concurrently, will retry next run ", payment.getId());
            }
        }
    }
}
/*
 * expireStalePayments() appeared at startup because of fixedDelay. It runs once at
 *      startup, then again 5 minutes after each run finishes. It will keep logging
 *      expireStalePayments running about every 5 minutes whether payments succeed, fail
 *      or don’t exist.
 *
 * flagRefundsForCancelledBookings() runs on a cron schedule, 0 0 * * * *, which
 *      means at minute 0 of every hour (17:00, 18:00, and so on). It doesn’t run at startup and it
 *      doesn’t care about payment failures. That’s why you didn’t see it in your log: you started
 *      at 16:49 and the next hour mark hadn’t arrived yet.
 *
 * What “payment fails” does:
 *  1. A failed or abandoned payment doesn’t start either job. The next
 *      expireStalePayments() tick (within 5 minutes) will simply find it if it’s still
 *      INITIATED and older than 15 minutes, and mark it EXPIRED.
 *  2. flagRefundsForCancelledBookings() has nothing to do with failures. It only looks
 *      at payments that succeeded (SUCCESS) and whose booking was later cancelled or
 *      rejected, so the money may need to go back.
 */

/*
 *Both jobs are connected to your app through the same three things: the Payment document in MongoDB, the Booking row in Postgres, and the status fields on each.

The full flow in your app

Customer clicks Book Now. POST /customer/booking creates a Booking in Postgres.
Service provider confirms it. The booking becomes CONFIRMED.
Customer pays. POST /customer/payments runs pay(). It checks the booking is yours and CONFIRMED,
then saves a Payment in MongoDB with status INITIATED.
The payment finishes or doesn’t.
With a gateway, a webhook sets it to SUCCESS or FAILED.
If it never finishes, the first scheduler job handles it.
The booking changes later. The customer or provider cancels, or the provider rejects,
so the booking becomes CANCELLED or REJECTED. If the payment was SUCCESS, the second scheduler job handles it.

How each job touches your app

expireStalePayments() works only on the payments collection.
It finds INITIATED payments older than 15 minutes and sets EXPIRED.
In your app, that frees the booking. pay() only blocks a booking when a SUCCESS payment already exists,
so a customer can pay again after an expiry.

flagRefundsForCancelledBookings() works across both databases. It reads SUCCESS payments from MongoDB,
then looks up their bookings in Postgres through bookingRepository. For any booking that’s CANCELLED
or REJECTED, it sets the payment to REFUND_PENDING.
In your app, this creates the to-do list of refunds an admin would process.
 */