import React from 'react';
import { motion } from 'framer-motion';

const items = [
  {
    id: 1,
    name: 'Margherita Pizza',
    image: '/pizza.jpg',
    price: 14.99,
    rating: 4.8,
    restaurant: 'The Italian Corner',
    description: 'Fresh tomatoes, mozzarella, basil',
  },
  {
    id: 2,
    name: 'Chicken Biryani',
    image: '/biryani.jpg',
    price: 16.99,
    rating: 4.9,
    restaurant: 'Spice Route',
    description: 'Aromatic basmati rice with tender chicken',
  },
  {
    id: 3,
    name: 'Classic Burger',
    image: '/burger.jpg',
    price: 12.99,
    rating: 4.7,
    restaurant: 'Burger House',
    description: 'Beef patty with fresh vegetables',
  },
  {
    id: 4,
    name: 'California Roll',
    image: '/sushi.jpg',
    price: 15.99,
    rating: 4.8,
    restaurant: 'Sushi Master',
    description: 'Crab, avocado, cucumber',
  },
  {
    id: 5,
    name: 'Pad Thai',
    image: '/padthai.jpg',
    price: 13.99,
    rating: 4.6,
    restaurant: 'Thai Delight',
    description: 'Rice noodles with shrimp and peanuts',
  },
  {
    id: 6,
    name: 'Caesar Salad',
    image: '/salad.jpg',
    price: 10.99,
    rating: 4.5,
    restaurant: 'Green Bowl',
    description: 'Romaine lettuce with parmesan',
  },
];

const PopularItems = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Popular Right Now
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the most ordered dishes from our top restaurants
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg shadow-md">
                  <span className="text-orange-500">★</span>
                  <span className="ml-1 font-medium">{item.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="font-semibold text-orange-500">
                    ${item.price}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{item.restaurant}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button className="btn bg-white text-gray-800 hover:bg-gray-100 border border-gray-200">
            View All Items
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularItems; 