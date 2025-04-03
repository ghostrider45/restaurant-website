import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import MenuItemCard from './MenuItemCard';
import RestaurantCard from './RestaurantCard';
import { collection, getDocs, query, limit, collectionGroup, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Navbar from '../NavbarNew';

const OrderFood = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not signed in, redirecting to sign-in page');
      navigate('/user/sign-in');
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Fetch restaurants
        const restaurantsQuery = query(collection(db, 'restaurants'), limit(10));
        const restaurantsSnapshot = await getDocs(restaurantsQuery);
        const restaurantsData = restaurantsSnapshot.docs.map(doc => {
          const data = doc.data();

          // Log restaurant image URL for debugging
          if (data.image) {
            console.log(`Restaurant image URL for ${data.name}:`, data.image);

            // If image is an object with url property (from old format)
            if (typeof data.image === 'object' && data.image.url) {
              console.log(`Found restaurant image URL in object format:`, data.image.url);
            }
          } else {
            console.log(`No image found for restaurant ${data.name}`);
          }

          // Normalize image field - handle both string URLs and object format
          let imageUrl = null;
          if (data.image) {
            if (typeof data.image === 'string') {
              imageUrl = data.image;
            } else if (typeof data.image === 'object' && data.image.url) {
              imageUrl = data.image.url;
            }
          }

          // Check restaurantImage field for backward compatibility
          if (!imageUrl && data.restaurantImage) {
            if (typeof data.restaurantImage === 'string') {
              imageUrl = data.restaurantImage;
            } else if (typeof data.restaurantImage === 'object' && data.restaurantImage.url) {
              imageUrl = data.restaurantImage.url;
            }
          }

          return {
            id: doc.id,
            ...data,
            // Use the normalized image URL
            image: imageUrl
          };
        });
        setRestaurants(restaurantsData);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMenuItems = async () => {
      try {
        setLoadingMenuItems(true);

        // Fetch menu items from the top-level collection
        console.log('Fetching menu items from top-level collection');

        // Query the top-level menuItems collection
        const menuItemsRef = collection(db, 'menuItems');
        const menuItemsQuery = query(menuItemsRef, limit(6));
        const menuItemsSnapshot = await getDocs(menuItemsQuery);

        console.log(`Found ${menuItemsSnapshot.docs.length} menu items in top-level collection`);

        // Process menu items
        const menuItemsData = menuItemsSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log(`Menu item data for ${doc.id}:`, data);

          // Log image URL specifically for debugging
          if (data.image) {
            console.log(`Image URL for ${data.name || doc.id}:`, data.image);

            // If image is an object with url property (from old format)
            if (typeof data.image === 'object' && data.image.url) {
              console.log(`Found image URL in object format:`, data.image.url);
            }
          } else {
            console.log(`No image found for ${data.name || doc.id}`);
          }

          // Normalize image field - handle both string URLs and object format
          let imageUrl = null;
          if (data.image) {
            if (typeof data.image === 'string') {
              imageUrl = data.image;
            } else if (typeof data.image === 'object' && data.image.url) {
              imageUrl = data.image.url;
            }
          }

          return {
            id: doc.id,
            ...data,
            // Make sure we have all required fields
            restaurantId: data.restaurantId || '',
            restaurant: data.restaurantName || 'Unknown Restaurant',
            // Calculate delivery time (preparation time + 5 min)
            deliveryTime: (data.preparationTime || 15) + 5,
            // Ensure price is available
            price: data.price || 0,
            // Ensure category is available
            category: data.category || 'Food',
            // Normalize image field
            image: imageUrl
          };
        });

        console.log('Processed menu items:', menuItemsData);

        // Sort by price
        menuItemsData.sort((a, b) => a.price - b.price);

        setMenuItems(menuItemsData);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoadingMenuItems(false);
      }
    };

    fetchRestaurants();
    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading restaurants and menu items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Order Food</h1>

        {/* Restaurants Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Restaurants Near You</h2>
            <Link to="/user/all-restaurants" className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>

        {/* Popular Menu Items Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Popular Menu Items</h2>
            <Link to="/user/all-dishes" className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm">
              View All
            </Link>
          </div>
          {loadingMenuItems ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading menu items...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No menu items found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderFood;
