import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Navbar from '../NavbarNew';

const CustomerDashboard = () => {
  const { user } = useUser();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user) return;

      try {
        // Get customer data from Firestore
        const customerDoc = await getDoc(doc(db, 'customers', user.id));

        if (customerDoc.exists()) {
          setCustomerData(customerDoc.data());
        }

        // For demo purposes, we'll use dummy data for recent orders and favorites
        // In a real app, you would fetch these from Firestore
        setRecentOrders([
          { id: 'ord123', restaurant: 'Pizza Palace', date: '2023-04-15', status: 'Delivered', total: 450 },
          { id: 'ord456', restaurant: 'Burger Barn', date: '2023-04-10', status: 'Delivered', total: 350 },
          { id: 'ord789', restaurant: 'Taco Town', date: '2023-04-05', status: 'Delivered', total: 250 },
        ]);

        setFavoriteRestaurants([
          { id: 'rest1', name: 'Pizza Palace', cuisine: 'Italian', rating: 4.5 },
          { id: 'rest2', name: 'Burger Barn', cuisine: 'American', rating: 4.2 },
          { id: 'rest3', name: 'Taco Town', cuisine: 'Mexican', rating: 4.7 },
        ]);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Profile Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="text-center mb-6">
                <img
                  src={user.imageUrl || 'https://via.placeholder.com/100'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-orange-100"
                />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {customerData?.name || user.fullName}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{user.primaryEmailAddress?.emailAddress}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Phone:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {customerData?.phone || 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Address:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {customerData?.address ? `${customerData.address.substring(0, 20)}...` : 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Member since:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {customerData?.createdAt ? new Date(customerData.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/user/profile"
                  className="block w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-center rounded-full transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/user/order-food"
                  className="block w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-center rounded-lg transition-colors font-medium"
                >
                  Order Food
                </Link>
                <Link
                  to="/user/orders"
                  className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-center rounded-lg transition-colors"
                >
                  View All Orders
                </Link>
                <Link
                  to="/user/favorites"
                  className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-center rounded-lg transition-colors"
                >
                  Favorite Restaurants
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Orders and Favorites */}
          <div className="lg:col-span-2">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Orders</h3>
                <Link
                  to="/user/orders"
                  className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm"
                >
                  View All
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Restaurant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {order.restaurant}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            ₹{order.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>You haven't placed any orders yet.</p>
                  <Link
                    to="/user/browse-restaurants"
                    className="mt-2 inline-block text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    Browse restaurants to place an order
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Favorite Restaurants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Favorite Restaurants</h3>
                <Link
                  to="/user/favorites"
                  className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm"
                >
                  View All
                </Link>
              </div>

              {favoriteRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteRestaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium text-gray-800 dark:text-white">{restaurant.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{restaurant.cuisine}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{restaurant.rating}</span>
                        </div>
                        <Link
                          to={`/user/restaurant/${restaurant.id}`}
                          className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
                        >
                          Order Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>You don't have any favorite restaurants yet.</p>
                  <Link
                    to="/user/browse-restaurants"
                    className="mt-2 inline-block text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    Browse restaurants to add favorites
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
