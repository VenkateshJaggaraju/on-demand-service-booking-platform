package com.on_demand_service_booking_platform.OnDemandServiceBookingPlatform.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadService {

    @Value("${CLOUDINARY_URL}")
    private String url;

    private String saveToCloud(MultipartFile image) {
        Cloudinary cloudinary = new Cloudinary(url);
        try {
            Map<String, String> map = ObjectUtils.asMap("folder", "OnDemandServiceBookingPlatform");
            Map data = cloudinary.uploader().upload(image.getBytes(), map);
            return (String) data.get("url");
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }
}

/*
FormData object is a built-in JavaScript Web API interface used to easily construct, manipulate,
and compile key/value pairs representing form fields and their values. It is primarily used to
send data (including text fields, files, and Blobs) asynchronously to a server via fetch() or
XMLHttpRequest in multipart/form-data format.
 */

/*
@Autowired
private ImageUploadService imageUploadService;

@Autowired
private CustomerRepository customerRepository;

public void registerCustomerWithImage(Long customerId, byte[] imageBytes) {
    try {
        // 1. Upload the image bytes to Cloudinary and receive the hosted link
        String cloudinaryUrl = imageUploadService.uploadImage(imageBytes);

        // 2. Map the URL string back to your database entity
        Customer customer = new Customer();
        customer.setId(customerId);
        customer.setProfileUrl(cloudinaryUrl);

        // 3. Save standard string metadata to PostgreSQL instead of heavy binary blobs
        customerRepository.save(customer);

    } catch (IOException e) {
        // Handle upload connection exceptions here
        e.printStackTrace();
    }
}

 */