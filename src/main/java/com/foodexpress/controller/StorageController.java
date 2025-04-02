package com.foodexpress.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/storage")
public class StorageController {
    
    private static final Logger logger = LoggerFactory.getLogger(StorageController.class);
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {
        try {
            // Add some logging to debug
            logger.info("Received file upload request");
            logger.info("File name: " + file.getOriginalFilename());
            logger.info("File size: " + file.getSize());
            
            // Verify Clerk token and get user ID
            String userId = verifyClerkToken(token);
            
            // Generate signed URL for Firebase Storage
            String signedUrl = generateSignedUrl(userId, file);
            
            // Return the signed URL to the frontend
            return ResponseEntity.ok(Map.of("uploadUrl", signedUrl));
        } catch (Exception e) {
            logger.error("Error uploading file: ", e);
            return ResponseEntity.internalServerError().body("Error uploading file: " + e.getMessage());
        }
    }

    private String verifyClerkToken(String token) {
       
        // You'll need to add Clerk SDK or use their API to verify the token
        // For now, returning a dummy user ID
        return "dummy-user-id";
    }

    private String generateSignedUrl(String userId, MultipartFile file) {
        
        // You'll need to use Firebase Admin SDK to generate the signed URL
        return "dummy-signed-url";
    }
}


