import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { getFromFirestore } from '../../utils/firestoreUtils';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!user) return;

      try {
        // Get restaurant data directly - no authentication needed with open rules
        const restaurantData = await getFromFirestore('restaurants', user.id);
        if (restaurantData) {
          setRestaurant(restaurantData);
        } else {
          console.error('Restaurant document not found');
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Restaurant data not found. Please complete your profile setup.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Restaurant Dashboard</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${restaurant.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {restaurant.isVerified ? 'Verified' : 'Verification Pending'}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {restaurant.restaurantImage ? (
                  <img
                    src={restaurant.restaurantImage.url}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              <div className="md:w-2/3">
                <h2 className="text-xl font-semibold text-gray-800">{restaurant.restaurantName}</h2>
                <p className="text-gray-600 mt-2">{restaurant.description || 'No description provided'}</p>
                <p className="text-gray-500 text-sm mt-1">Owner: {restaurant.ownerName}</p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p>{restaurant.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p>{restaurant.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">FSSAI License</h3>
                    <p>{restaurant.fssaiLicense}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Hours</h3>
                    <p>{restaurant.openingTime} - {restaurant.closingTime}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p>{restaurant.address}, {restaurant.city}, {restaurant.state} - {restaurant.pincode}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Cuisine Types</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {restaurant.cuisineTypes && restaurant.cuisineTypes.map(cuisine => (
                      <span key={cuisine} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 transition-colors"
                onClick={() => navigate('/restaurant/menu')}
              >
                Menu Management
              </button>
              <button
                className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 transition-colors"
                onClick={() => navigate('/restaurant/orders')}
              >
                View Orders
              </button>
              <button
                className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 transition-colors"
                onClick={() => navigate('/restaurant/edit-profile')}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
