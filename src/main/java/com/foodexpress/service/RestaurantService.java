package com.foodexpress.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.foodexpress.model.Restaurant;
import java.time.Instant;
import java.util.concurrent.ExecutionException;

@Service
public class RestaurantService {
    private static final String COLLECTION_NAME = "restaurants";
    private static final Logger logger = LoggerFactory.getLogger(RestaurantService.class);

    public Restaurant createRestaurant(Restaurant restaurant) throws ExecutionException, InterruptedException {
        logger.info("Creating restaurant with ID: {}", restaurant.getId());
        Firestore firestore = FirestoreClient.getFirestore();
        
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(restaurant.getId());
            DocumentSnapshot document = docRef.get().get();
            
            if (document.exists()) {
                logger.warn("Restaurant already exists with ID: {}", restaurant.getId());
                return document.toObject(Restaurant.class);
            }

            // Set timestamps if not already set
            if (restaurant.getCreatedAt() == null) {
                restaurant.setCreatedAt(Instant.now().toString());
            }
            if (restaurant.getUpdatedAt() == null) {
                restaurant.setUpdatedAt(Instant.now().toString());
            }

            // Set default values
            restaurant.setVerified(false);
            restaurant.setProfileComplete(false);
            
            docRef.set(restaurant).get();
            logger.info("Successfully created restaurant with ID: {}", restaurant.getId());
            
            return docRef.get().get().toObject(Restaurant.class);
        } catch (Exception e) {
            logger.error("Error creating restaurant: ", e);
            throw e;
        }
    }

    public Restaurant getRestaurant(String id) throws ExecutionException, InterruptedException {
        logger.info("Fetching restaurant with ID: {}", id);
        Firestore firestore = FirestoreClient.getFirestore();
        
        try {
            DocumentSnapshot document = firestore.collection(COLLECTION_NAME).document(id).get().get();
            if (!document.exists()) {
                logger.warn("Restaurant not found with ID: {}", id);
                return null;
            }
            return document.toObject(Restaurant.class);
        } catch (Exception e) {
            logger.error("Error fetching restaurant: ", e);
            throw e;
        }
    }

    public Restaurant updateRestaurant(Restaurant restaurant) throws ExecutionException, InterruptedException {
        logger.info("Updating restaurant with ID: {}", restaurant.getId());
        Firestore firestore = FirestoreClient.getFirestore();
        
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(restaurant.getId());
            DocumentSnapshot document = docRef.get().get();
            
            if (!document.exists()) {
                logger.warn("Restaurant not found for update with ID: {}", restaurant.getId());
                return null;
            }

            restaurant.setUpdatedAt(Instant.now().toString());
            docRef.set(restaurant).get();
            
            logger.info("Successfully updated restaurant with ID: {}", restaurant.getId());
            return docRef.get().get().toObject(Restaurant.class);
        } catch (Exception e) {
            logger.error("Error updating restaurant: ", e);
            throw e;
        }
    }
}





