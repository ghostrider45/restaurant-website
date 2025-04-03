import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Food images for fallback
import defaultFoodImg from '../../assets/images/default-food.jpg';

const MenuItemCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  // Function to handle image loading errors
  const handleImageError = () => {
    console.log(`Error loading image for ${item.name}`);
    setImageError(true);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <Link to={`/user/restaurant/${item.restaurantId}?highlight=${item.id}`}>
        <div className="relative h-48">
          {!imageError && item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">{item.name}</span>
            </div>
          )}
          <div className="absolute top-0 right-0 bg-orange-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
            ₹{item.price || 0}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{item.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{item.restaurant}</p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-gray-700 dark:text-gray-300 text-sm ml-1">{item.rating || 4.5}</span>
            </div>
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
              {item.category || 'Food'}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {item.deliveryTime} min
            </span>
            <button className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors text-sm">
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MenuItemCard;
