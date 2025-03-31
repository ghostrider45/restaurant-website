package com.foodexpress.controller;

import com.foodexpress.model.Restaurant;
import com.foodexpress.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantController {
    
    private static final Logger logger = LoggerFactory.getLogger(RestaurantController.class);
    private final RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<?> createRestaurant(@RequestBody Restaurant restaurant) {
        try {
            Restaurant created = restaurantService.createRestaurant(restaurant);
            if (created == null) {
                return ResponseEntity.badRequest().body("Restaurant already exists");
            }
            return ResponseEntity.ok(created);
        } catch (ExecutionException | InterruptedException e) {
            logger.error("Error creating restaurant: ", e);
            return ResponseEntity.internalServerError().body("Error creating restaurant: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurant(@PathVariable String id) {
        try {
            Restaurant restaurant = restaurantService.getRestaurant(id);
            if (restaurant == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(restaurant);
        } catch (ExecutionException | InterruptedException e) {
            logger.error("Error fetching restaurant: ", e);
            return ResponseEntity.internalServerError().body("Error fetching restaurant: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRestaurant(@PathVariable String id, @RequestBody Restaurant restaurant) {
        try {
            logger.info("Updating restaurant with ID: {}", id);
            logger.debug("Update data: {}", restaurant);

            // Ensure the ID matches
            if (!id.equals(restaurant.getId())) {
                logger.warn("ID mismatch. Path ID: {}, Body ID: {}", id, restaurant.getId());
                return ResponseEntity.badRequest().body("ID mismatch");
            }

            Restaurant updated = restaurantService.updateRestaurant(restaurant);
            if (updated == null) {
                logger.warn("Restaurant not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }

            logger.info("Successfully updated restaurant: {}", updated);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating restaurant: ", e);
            return ResponseEntity.internalServerError().body("Error updating restaurant: " + e.getMessage());
        }
    }
}


