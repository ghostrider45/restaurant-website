import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Floating Food Images */}
      <motion.img
        src="/dish1.png"
        alt="Floating Dish 1"
        className="absolute w-48 h-48 object-contain floating"
        style={{ top: '20%', right: '15%' }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      <motion.img
        src="/dish2.png"
        alt="Floating Dish 2"
        className="absolute w-40 h-40 object-contain floating"
        style={{ bottom: '25%', left: '10%' }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Delicious Food Delivered To Your Doorstep
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Choose from thousands of restaurants and get your favorite meals delivered in minutes
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="btn btn-primary text-lg px-8 py-3">
              Order Now
            </button>
            <button className="btn bg-white text-gray-800 hover:bg-gray-100 text-lg px-8 py-3">
              View Menu
            </button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { title: 'Fast Delivery', description: 'Within 30 minutes' },
              { title: 'Fresh Food', description: 'Prepared with love' },
              { title: 'Free Delivery', description: 'On orders above $30' },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 text-white"
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero; 