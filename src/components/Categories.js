import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'All', icon: '🍽️' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burger', icon: '🍔' },
  { name: 'Sushi', icon: '🍱' },
  { name: 'Indian', icon: '🍛' },
  { name: 'Chinese', icon: '🥡' },
  { name: 'Italian', icon: '🍝' },
  { name: 'Mexican', icon: '🌮' },
  { name: 'Desserts', icon: '🍰' },
  { name: 'Drinks', icon: '🥤' },
];

const Categories = () => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
        >
          Explore Categories
        </motion.h2>

        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
          >
            →
          </button>

          {/* Categories Container */}
          <div
            ref={containerRef}
            className="overflow-x-auto hide-scrollbar flex space-x-6 px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="flex-shrink-0"
              >
                <button className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 w-40 flex flex-col items-center space-y-3">
                  <span className="text-4xl">{category.icon}</span>
                  <span className="font-medium text-gray-800">{category.name}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Categories; 