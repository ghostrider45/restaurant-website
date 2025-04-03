import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Default restaurant image for fallback
import defaultRestaurantImg from '../../assets/images/default-restaurant.jpg';

const RestaurantCard = ({ restaurant }) => {
  const [imageError, setImageError] = useState(false);

  // Function to handle image loading errors
  const handleImageError = () => {
    console.log(`Error loading image for ${restaurant.name}`);
    setImageError(true);
  };

  // Function to get the image URL from different formats
  const getImageUrl = () => {
    if (!restaurant.image) return null;

    // If image is a string, use it directly
    if (typeof restaurant.image === 'string') {
      return restaurant.image;
    }

    // If image is an object with url property (from uploadFileToStorage)
    if (typeof restaurant.image === 'object') {
      if (restaurant.image.url) return restaurant.image.url;

      // For backward compatibility with restaurantImage field
      if (restaurant.restaurantImage && restaurant.restaurantImage.url) {
        return restaurant.restaurantImage.url;
      }
    }

    // For backward compatibility with restaurantImage field as string
    if (restaurant.restaurantImage) {
      if (typeof restaurant.restaurantImage === 'string') {
        return restaurant.restaurantImage;
      }
      if (typeof restaurant.restaurantImage === 'object' && restaurant.restaurantImage.url) {
        return restaurant.restaurantImage.url;
      }
    }

    return null;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <Link to={`/user/restaurant/${restaurant.id}`}>
        <div className="relative h-48">
          {!imageError && getImageUrl() ? (
            <img
              src={getImageUrl()}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
              <span className="text-gray-600 dark:text-gray-400 text-xl font-bold">{restaurant.name}</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-semibold text-lg">{restaurant.name}</h3>
            <div className="flex items-center mt-1">
              <span className="text-yellow-400">★</span>
              <span className="text-white text-sm ml-1">{restaurant.rating || 4.5}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {restaurant.cuisineTypes && restaurant.cuisineTypes.map((cuisine, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full"
              >
                {cuisine}
              </span>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{restaurant.address}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;
