package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class GeneralController {

    // go to the <AdminLogin/> and load the <HomePage/> after successful admin-login and store jwtToken in localStorage()
    @GetMapping("/")
    public RedirectView home() {

        return new RedirectView("http://localhost:5173/admin/login");
    }

}
/* Note:
 * The following apis are specifically dedicated to Postman;
 * Rest of all other apis works in both Browser and Postman
 *
 * If ServiceProvider wants to see customers
 * then both Customer(login in new tab) and ServiceProvider have logins
 *
 * Postman(user) endpoints
 *
 *      /admin/register
 *
 *      /customer/booking --> GET() and POST()
 *      /customer/booking/{id}
 *
 *      /service-provider/booking
 *      /service-provider/booking/service/{id}/pending
 *      /service-provider/booking/{id}/status
 *
 *
 *
 */