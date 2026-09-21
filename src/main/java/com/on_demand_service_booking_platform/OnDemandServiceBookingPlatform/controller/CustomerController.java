package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.controller;

import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CustomerLoginRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CustomerRequestDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.dto.CustomerResponseDTO;
import com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

   @Autowired
   private CustomerService customerService;

    //    @PostMapping(value = "/register", consumes = "multipart/form-data")
    @PostMapping(value = "/register")
    public CustomerResponseDTO register(@RequestBody CustomerRequestDTO dto) {
        return customerService.register(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody CustomerLoginRequestDTO dto) {
        return customerService.login(dto);
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {
        return customerService.logout(request);
    }

    @GetMapping("/payments")
    public String payment(){
        return "payment api";
    }

    @GetMapping("/services")
    public String services() {
        return "All services are available";
    }

}

/*
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
        import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@CrossOrigin(origins = "http://localhost:5173") // Adjust to match your React port
@RestController
@RequestMapping("/service-provider")
public class ServiceProviderController {

    @PostMapping("/register")
    public ResponseEntity<?> registerProvider(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("mobileNumber") Long mobileNumber,
            @RequestParam("email") String email,
            @RequestParam(value = "profile", required = false) MultipartFile profileFile) {

        try {
            byte[] imageBytes = null;

            // Convert MultipartFile into the raw byte[] array you need
            if (profileFile != null && !profileFile.isEmpty()) {
                imageBytes = profileFile.getBytes();
            }

            // Now you have your byte[] ready!
            // Step A: Send 'imageBytes' to your Cloudinary service wrapper
            // Step B: Save everything to your PostgreSQL table

            return ResponseEntity.status(HttpStatus.CREATED).body("Account created successfully");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process profile image processing");
        }
    }
}
*/
/*
const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Create a FormData instance
    const formData = new FormData();

    // 2. Append all structural fields
    formData.append("username", username);
    formData.append("password", password);
    formData.append("mobileNumber", mobileNumber); // Will be parsed as a number by Java
    formData.append("email", email);

    // 3. Append the file binary if it exists
    if (profile) {
        formData.append("profile", profile);
    }

    try {
        // 4. Send the formData object directly
        const response = await axios.post(
            "http://localhost:1086/service-provider/register",
            formData
        );

        console.log("Status:", response.status);
        console.log("Backend response:", response.data);

        alert("Service provider account created successfully!");
        navigate("/service-provider/login");

    } catch (error: any) {
        console.error("Registration error:", error);
        if (error.response?.status === 409) {
            setError("Username, email or mobile number already exists");
        } else if (error.response?.status === 400) {
            setError("Invalid registration details.");
        } else if (!error.response) {
            setError("Unable to connect to server.");
        } else {
            setError("Registration failed. Please try again.");
        }
    } finally {
        setLoading(false);
    }
};

 */
