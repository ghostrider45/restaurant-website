package com.foodexpress.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {
    private String id;  // Clerk user ID
    private String name;
    private String email;
    private String phone;
    private String address;
    private String[] cuisineTypes;
    private boolean isVerified;
    private boolean isProfileComplete;
    private String createdAt;
    private String updatedAt;
    
    // Profile setup fields
    private String fssaiLicense;
    private String openingTime;
    private String closingTime;
    private String description;
    private String city;
    private String state;
    private String pincode;
    private String restaurantImage;
}

