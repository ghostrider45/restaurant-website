import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

// Default images for fallback
import defaultRestaurantImg from '../../assets/images/default-restaurant.jpg';
import defaultFoodImg from '../../assets/images/default-food.jpg';
import { db } from '../../config/firebase';
import Navbar from '../NavbarNew';

const RestaurantDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);

  // Check if user is authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not signed in, redirecting to sign-in page');
      navigate('/user/sign-in');
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Get highlighted item from URL query params
  const searchParams = new URLSearchParams(location.search);
  const highlightedItemId = searchParams.get('highlight');

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        // Fetch restaurant data
        const restaurantDoc = await getDoc(doc(db, 'restaurants', id));

        if (restaurantDoc.exists()) {
          const restaurantData = restaurantDoc.data();

          // Log restaurant image URL for debugging
          if (restaurantData.image) {
            console.log(`Restaurant image URL:`, restaurantData.image);
          } else {
            console.log(`No image found for restaurant`);
          }

          // Normalize restaurant image field
          let restaurantImageUrl = null;
          if (restaurantData.image) {
            if (typeof restaurantData.image === 'string') {
              restaurantImageUrl = restaurantData.image;
            } else if (typeof restaurantData.image === 'object' && restaurantData.image.url) {
              restaurantImageUrl = restaurantData.image.url;
            }
          }

          setRestaurant({
            id: restaurantDoc.id,
            ...restaurantData,
            image: restaurantImageUrl
          });

          // Fetch menu items from the top-level collection for this restaurant
          console.log(`Fetching menu items for restaurant: ${id}`);

          // Query the top-level menuItems collection filtered by restaurantId
          const menuItemsRef = collection(db, 'menuItems');
          const menuItemsQuery = query(menuItemsRef, where('restaurantId', '==', id));
          const menuItemsSnapshot = await getDocs(menuItemsQuery);

          console.log(`Found ${menuItemsSnapshot.docs.length} menu items for restaurant: ${id}`);

          if (menuItemsSnapshot.docs.length > 0) {
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
                restaurantId: data.restaurantId || id,
                restaurant: data.restaurantName || restaurant.name,
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

            setMenuItems(menuItemsData);

            // Extract categories from menu items
            const cats = ['all', ...new Set(menuItemsData.map(item => item.category || 'Other'))];
            setCategories(cats);
          } else {
            // If no menu items found, use dummy data
            console.log('No menu items found, using dummy data');
            const dummyItems = getDummyMenuItems(id);
            setMenuItems(dummyItems);

            // Extract categories from dummy menu items
            const cats = ['all', ...new Set(dummyItems.map(item => item.category))];
            setCategories(cats);
          }
        } else {
          // If no real restaurant data, use dummy data
          console.log('Restaurant not found, using dummy data');
          setRestaurant(getDummyRestaurant(id));
          setMenuItems(getDummyMenuItems(id));

          // Extract categories from dummy menu items
          const cats = ['all', ...new Set(getDummyMenuItems(id).map(item => item.category))];
          setCategories(cats);
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [id]);

  const [restaurantImageError, setRestaurantImageError] = useState(false);
  const [menuItemImageErrors, setMenuItemImageErrors] = useState({});

  // Function to handle restaurant image loading errors
  const handleRestaurantImageError = () => {
    console.log(`Error loading image for restaurant: ${restaurant?.name}`);
    setRestaurantImageError(true);
  };

  // Function to handle menu item image loading errors
  const handleMenuItemImageError = (itemId) => {
    console.log(`Error loading image for menu item: ${itemId}`);
    setMenuItemImageErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  // Function to get the restaurant image URL from different formats
  const getRestaurantImageUrl = () => {
    if (!restaurant) return null;

    // Check image field
    if (restaurant.image) {
      // If image is a string, use it directly
      if (typeof restaurant.image === 'string') {
        return restaurant.image;
      }

      // If image is an object with url property
      if (typeof restaurant.image === 'object' && restaurant.image.url) {
        return restaurant.image.url;
      }
    }

    // Check restaurantImage field for backward compatibility
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

  // Function to get dummy restaurant data
  const getDummyRestaurant = (restaurantId) => {
    const dummyRestaurants = {
      'rest1': {
        id: 'rest1',
        name: 'Punjabi Delight',
        cuisineTypes: ['Indian', 'North Indian'],
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        address: '123 Main St, Delhi',
        city: 'Delhi',
        description: 'Authentic North Indian cuisine with a modern twist. Our chefs bring you the flavors of Punjab right to your table.'
      },
      'rest2': {
        id: 'rest2',
        name: 'Pizza Palace',
        cuisineTypes: ['Italian', 'Fast Food'],
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        address: '456 Park Ave, Mumbai',
        city: 'Mumbai',
        description: 'Serving the best pizzas in town with fresh ingredients and authentic Italian recipes.'
      },
      'rest3': {
        id: 'rest3',
        name: 'Biryani House',
        cuisineTypes: ['Indian', 'Hyderabadi'],
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
        address: '789 Biryani Lane, Hyderabad',
        city: 'Hyderabad',
        description: 'Specializing in authentic Hyderabadi biryani and other delicious Indian dishes.'
      }
    };

    return dummyRestaurants[restaurantId] || {
      id: restaurantId,
      name: 'Restaurant ' + restaurantId,
      cuisineTypes: ['Various'],
      rating: 4.0,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      address: 'Sample Address',
      city: 'Sample City',
      description: 'A great place to enjoy delicious food.'
    };
  };

  // Function to get dummy menu items
  const getDummyMenuItems = (restaurantId) => {
    const menuItemsByRestaurant = {
      'rest1': [
        {
          id: 'item1',
          name: 'Butter Chicken',
          description: 'Tender chicken cooked in a rich buttery tomato sauce.',
          price: 350,
          image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YnV0dGVyJTIwY2hpY2tlbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
          category: 'Main Course',
          isVeg: false,
          rating: 4.8
        },
        {
          id: 'item2',
          name: 'Paneer Tikka',
          description: 'Chunks of paneer marinated in spices and grilled to perfection.',
          price: 280,
          image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGFuZWVyJTIwdGlra2F8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
          category: 'Starters',
          isVeg: true,
          rating: 4.6
        },
        {
          id: 'item3',
          name: 'Dal Makhani',
          description: 'Black lentils cooked with butter and cream.',
          price: 220,
          image: 'https://images.unsplash.com/photo-1626100846883-cfb0c4c13a1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFsJTIwbWFraGFuaXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
          category: 'Main Course',
          isVeg: true,
          rating: 4.5
        },
        {
          id: 'item4',
          name: 'Naan',
          description: 'Soft leavened bread baked in a tandoor.',
          price: 50,
          image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmFhbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
          category: 'Breads',
          isVeg: true,
          rating: 4.7
        },
        {
          id: 'item5',
          name: 'Gulab Jamun',
          description: 'Deep-fried milk solids soaked in sugar syrup.',
          price: 120,
          image: 'https://images.unsplash.com/photo-1601303516361-9e7a1e01a7ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3VsYWIlMjBqYW11bnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
          category: 'Desserts',
          isVeg: true,
          rating: 4.9
        }
      ],
      'rest2': [
        {
          id: 'item6',
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and basil.',
          price: 299,
          image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
          category: 'Pizza',
          isVeg: true,
          rating: 4.6
        },
        {
          id: 'item7',
          name: 'Pepperoni Pizza',
          description: 'Pizza topped with pepperoni slices and cheese.',
          price: 349,
          image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
          category: 'Pizza',
          isVeg: false,
          rating: 4.7
        },
        {
          id: 'item8',
          name: 'Garlic Bread',
          description: 'Bread topped with garlic butter and herbs.',
          price: 149,
          image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
          category: 'Sides',
          isVeg: true,
          rating: 4.5
        },
        {
          id: 'item9',
          name: 'Pasta Alfredo',
          description: 'Creamy pasta with parmesan cheese sauce.',
          price: 249,
          image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023882c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFzdGElMjBhbGZyZWRvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
          category: 'Pasta',
          isVeg: true,
          rating: 4.4
        },
        {
          id: 'item10',
          name: 'Chocolate Mousse',
          description: 'Rich and creamy chocolate dessert.',
          price: 199,
          image: 'https://images.unsplash.com/photo-1611329695518-1763319f3551?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvY29sYXRlJTIwbW91c3NlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
          category: 'Desserts',
          isVeg: true,
          rating: 4.8
        }
      ],
      'rest3': [
        {
          id: 'item11',
          name: 'Chicken Biryani',
          description: 'Fragrant rice dish with chicken, spices, and herbs.',
          price: 280,
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGJpcnlhbml8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
          category: 'Biryani',
          isVeg: false,
          rating: 4.9
        },
        {
          id: 'item12',
          name: 'Veg Biryani',
          description: 'Fragrant rice dish with vegetables, spices, and herbs.',
          price: 250,
          image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YmlyeWFuaXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
          category: 'Biryani',
          isVeg: true,
          rating: 4.5
        },
        {
          id: 'item13',
          name: 'Chicken 65',
          description: 'Spicy, deep-fried chicken dish.',
          price: 220,
          image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMDY1fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
          category: 'Starters',
          isVeg: false,
          rating: 4.6
        },
        {
          id: 'item14',
          name: 'Hyderabadi Haleem',
          description: 'Stew composed of meat, lentils, and pounded wheat.',
          price: 260,
          image: 'https://images.unsplash.com/photo-1630409351217-bc4fa6422075?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGFsZWVtfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
          category: 'Main Course',
          isVeg: false,
          rating: 4.7
        },
        {
          id: 'item15',
          name: 'Double Ka Meetha',
          description: 'Bread pudding dessert with saffron and nuts.',
          price: 150,
          image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzc2VydHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
          category: 'Desserts',
          isVeg: true,
          rating: 4.4
        }
      ]
    };

    return menuItemsByRestaurant[restaurantId] || [];
  };

  // Filter menu items by category
  const filteredMenuItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading restaurant details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Restaurant Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">The restaurant you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80">
        {!restaurantImageError && getRestaurantImageUrl() ? (
          <img
            src={getRestaurantImageUrl()}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={handleRestaurantImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
            <span className="text-gray-600 dark:text-gray-400 text-2xl font-bold">{restaurant.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{restaurant.name}</h1>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-white">{restaurant.rating}</span>
                  <span className="mx-2 text-white">•</span>
                  <span className="text-white">{restaurant.cuisineTypes?.join(', ')}</span>
                </div>
                <p className="text-gray-200">{restaurant.address}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors">
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Restaurant Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">About {restaurant.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{restaurant.description}</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {category === 'all' ? 'All Items' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                highlightedItemId === item.id ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              <div className="relative h-48">
                {!menuItemImageErrors[item.id] && item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={() => handleMenuItemImageError(item.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">{item.name}</span>
                  </div>
                )}
                <div className="absolute top-0 right-0 bg-orange-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
                  ₹{item.price}
                </div>
                {item.isVeg ? (
                  <div className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 m-2 rounded-md text-xs">
                    VEG
                  </div>
                ) : (
                  <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-xs">
                    NON-VEG
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{item.name}</h3>
                  <div className="flex items-center bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                    <span className="text-yellow-500">★</span>
                    <span className="text-green-800 dark:text-green-200 text-sm ml-1">{item.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                    {item.category}
                  </span>
                  <button className="px-4 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMenuItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No menu items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
