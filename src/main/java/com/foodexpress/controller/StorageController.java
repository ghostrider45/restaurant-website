package com.foodexpress.controller;

import dev.clerk.sdk.ClerkClient;
import dev.clerk.sdk.session.Session;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.firebase.cloud.StorageClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
public class StorageController {
    
    private static final Logger logger = LoggerFactory.getLogger(StorageController.class);
    
    @Value("${clerk.secret.key}")
    private String clerkSecretKey;
    
    @Value("${firebase.storage.bucket}")
    private String storageBucket;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {
        try {
            // Remove "Bearer " prefix if present
            String cleanToken = token.replace("Bearer ", "");
            
            // Verify Clerk token and get user ID
            String userId = verifyClerkToken(cleanToken);
            
            // Generate signed URL for Firebase Storage
            String signedUrl = generateSignedUrl(userId, file);
            
            return ResponseEntity.ok(Map.of("uploadUrl", signedUrl));
        } catch (Exception e) {
            logger.error("Error uploading file: ", e);
            return ResponseEntity.internalServerError().body("Error uploading file: " + e.getMessage());
        }
    }

    private String verifyClerkToken(String token) throws Exception {
        ClerkClient clerk = ClerkClient.builder()
            .secretKey(clerkSecretKey)
            .build();
            
        try {
            Session session = clerk.sessions().verifySession(token);
            return session.getId(); // Use getId() instead of userId
        } catch (Exception e) {
            logger.error("Failed to verify Clerk token: ", e);
            throw new Exception("Invalid authentication token");
        }
    }

    private String generateSignedUrl(String userId, MultipartFile file) throws Exception {
        try {
            // Get Firebase Storage instance
            Storage storage = StorageClient.getInstance().bucket(storageBucket).getStorage();
            
            // Create the blob path
            String blobPath = String.format("restaurants/%s/images/%s", userId, file.getOriginalFilename());
            BlobId blobId = BlobId.of(storageBucket, blobPath);
            
            // Create blob info with content type
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();
            
            // Generate signed URL that expires in 15 minutes
            return storage.signUrl(blobInfo, 15, TimeUnit.MINUTES, Storage.SignUrlOption.withV4Signature())
                .toString();
                
        } catch (Exception e) {
            logger.error("Failed to generate signed URL: ", e);
            throw new Exception("Failed to generate upload URL");
        }
    }
}


