import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const RestaurantHome = () => {
  const { signOut } = useAuth();
  const { isSignedIn, isLoaded, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        console.log('User not signed in, redirecting to sign-in page');
        navigate('/restaurant/sign-in');
        return;
      }

      console.log('Checking if user is a restaurant owner:', user.id);

      try {
        // Check if user exists in restaurants collection
        const restaurantDocRef = doc(db, 'restaurants', user.id);
        console.log('Checking restaurant document at path:', restaurantDocRef.path);

        const restaurantDoc = await getDoc(restaurantDocRef);
        console.log('Restaurant document exists:', restaurantDoc.exists());

        if (!restaurantDoc.exists()) {
          console.log('User is not a restaurant owner, redirecting to unauthorized');
          // If not a restaurant owner, redirect to unauthorized
          navigate('/unauthorized');
        } else {
          console.log('User is a restaurant owner, data:', restaurantDoc.data());
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    checkUserRole();
  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-orange-500">Restaurant Dashboard</div>
            <div className="space-x-4">
              <Link
                to="/"
                className="px-6 py-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                Back to Home
              </Link>
              <button
                onClick={() => signOut()}
                className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <Link
                  to="/restaurant"
                  className="block px-4 py-2 bg-orange-50 text-orange-500 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  to="/restaurant/menu"
                  className="block px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-lg"
                >
                  Menu Management
                </Link>
                <Link
                  to="/restaurant/orders"
                  className="block px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-lg"
                >
                  Orders
                </Link>
                <Link
                  to="/restaurant/earnings"
                  className="block px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-lg"
                >
                  Earnings
                </Link>
                <Link
                  to="/restaurant/reviews"
                  className="block px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-lg"
                >
                  Reviews
                </Link>
                <Link
                  to="/restaurant/settings"
                  className="block px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-lg"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="text-gray-500 text-sm mb-2">Today's Orders</h3>
                <p className="text-3xl font-bold text-gray-800">24</p>
                <p className="text-green-500 text-sm mt-2">↑ 12% from yesterday</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="text-gray-500 text-sm mb-2">Today's Earnings</h3>
                <p className="text-3xl font-bold text-gray-800">$1,234</p>
                <p className="text-green-500 text-sm mt-2">↑ 8% from yesterday</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="text-gray-500 text-sm mb-2">Average Rating</h3>
                <p className="text-3xl font-bold text-gray-800">4.8</p>
                <p className="text-green-500 text-sm mt-2">↑ 0.2 from last week</p>
              </motion.div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-4">Order ID</th>
                      <th className="pb-4">Customer</th>
                      <th className="pb-4">Items</th>
                      <th className="pb-4">Total</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-4">#12345</td>
                      <td>John Doe</td>
                      <td>2 items</td>
                      <td>$45.99</td>
                      <td>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          Preparing
                        </span>
                      </td>
                      <td>
                        <button className="text-orange-500 hover:text-orange-600">
                          View Details
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-4">#12344</td>
                      <td>Jane Smith</td>
                      <td>3 items</td>
                      <td>$67.99</td>
                      <td>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Ready
                        </span>
                      </td>
                      <td>
                        <button className="text-orange-500 hover:text-orange-600">
                          View Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popular Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Popular Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="border rounded-lg p-4"
                >
                  <img
                    src="/item1.jpg"
                    alt="Popular Item"
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-gray-800">Margherita Pizza</h3>
                  <p className="text-gray-500 text-sm">Orders: 156</p>
                  <p className="text-orange-500 font-semibold mt-2">$12.99</p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="border rounded-lg p-4"
                >
                  <img
                    src="/item2.jpg"
                    alt="Popular Item"
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-gray-800">Chicken Burger</h3>
                  <p className="text-gray-500 text-sm">Orders: 143</p>
                  <p className="text-orange-500 font-semibold mt-2">$8.99</p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="border rounded-lg p-4"
                >
                  <img
                    src="/item3.jpg"
                    alt="Popular Item"
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-gray-800">Pasta Alfredo</h3>
                  <p className="text-gray-500 text-sm">Orders: 98</p>
                  <p className="text-orange-500 font-semibold mt-2">$14.99</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHome;
