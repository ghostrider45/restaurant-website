import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Hero from './Hero';
import Categories from './Categories';
import FeaturedRestaurants from './FeaturedRestaurants';
import PopularItems from './PopularItems';
import Testimonials from './Testimonials';
import Footer from './Footer';

const UserHome = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode='wait'>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-white z-50"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Navbar />
            <Hero />
            <Categories />
            <FeaturedRestaurants />
            <PopularItems />
            <Testimonials />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserHome; 