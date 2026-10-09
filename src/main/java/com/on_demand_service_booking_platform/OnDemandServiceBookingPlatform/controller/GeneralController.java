package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
//@CrossOrigin(origins = "http://localhost:5173")
public class GeneralController {

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    // go to the <AdminLogin/> and load the <HomePage/> after successful admin-login and store jwtToken in localStorage()
//    @GetMapping("/")
//    public RedirectView home() {
//
//        return new RedirectView("http://localhost:5173/admin/login");
//    }

    @GetMapping("/")
    public RedirectView home() {
        return new RedirectView(frontendUrl + "/admin/login");
    }
}
/*
 * Note:
 * The following APIs are specifically dedicated to Postman;
 * Rest of all other APIs works in both Browser and Postman
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
 *
 */

/*
 * Key takeaways:
 *
 * 1. Only one user can access this application at a time, if the app is running on localhost
 *
 * 2. If ServiceProvider wants to see customers
 *    then both Customer(login in new tab) and ServiceProvider have logins (if the app is running on localhost)
 *
 * 3. cause of OptimisticLockException
 *
 *    userA's(eg., ServiceProvider A) request loads booking 5 (version 0)
 *    userB's(eg., ServiceProvider B) request loads booking 5 (version 0)
 *
 *    userA commits: UPDATE ... SET status='CONFIRMED', version=1 WHERE id=5 AND version=0 succeeds
 *    userB tries: UPDATE ... SET status='REJECTED', version=1 WHERE id=5 AND version=0 matches 0 rows,
 *                 so Hibernate throws the exception and userB's transaction rolls back
 *
 *    Final state: CONFIRMED with userA's reason. userB's change is never saved,
 *                 and userB gets the 409 from your exception handler.
 */