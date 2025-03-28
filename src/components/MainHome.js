import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MainHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-orange-500">FoodExpress</div>
            <div className="space-x-4">
              <Link
                to="/user"
                className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                User Login
              </Link>
              <Link
                to="/restaurant"
                className="px-6 py-2 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-colors"
              >
                Restaurant Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Order Delicious Food Online
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose from thousands of restaurants and get your favorite food delivered to your doorstep.
            </p>
            <div className="space-x-4">
              <Link
                to="/user"
                className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors inline-block"
              >
                Order Food
              </Link>
              <Link
                to="/restaurant"
                className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-colors inline-block"
              >
                Register Restaurant
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src="/hero-image.jpg"
              alt="Delicious Food"
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your food delivered quickly and hot</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Food</h3>
              <p className="text-gray-600">Best restaurants with quality food</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive prices and great deals</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-orange-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers and restaurants</p>
          <div className="space-x-4">
            <Link
              to="/user"
              className="px-8 py-3 bg-white text-orange-500 rounded-full hover:bg-orange-50 transition-colors inline-block"
            >
              Order Now
            </Link>
            <Link
              to="/restaurant"
              className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-orange-600 transition-colors inline-block"
            >
              Register Restaurant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainHome; 