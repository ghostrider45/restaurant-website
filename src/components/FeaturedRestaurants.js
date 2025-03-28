import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const restaurants = [
  {
    id: 1,
    name: 'The Italian Corner',
    image: '/restaurant1.jpg',
    rating: 4.8,
    cuisine: 'Italian',
    deliveryTime: '25-35',
    minOrder: 15,
  },
  {
    id: 2,
    name: 'Sushi Master',
    image: '/restaurant2.jpg',
    rating: 4.9,
    cuisine: 'Japanese',
    deliveryTime: '30-40',
    minOrder: 20,
  },
  {
    id: 3,
    name: 'Burger House',
    image: '/restaurant3.jpg',
    rating: 4.7,
    cuisine: 'American',
    deliveryTime: '20-30',
    minOrder: 10,
  },
  {
    id: 4,
    name: 'Spice Route',
    image: '/restaurant4.jpg',
    rating: 4.6,
    cuisine: 'Indian',
    deliveryTime: '30-45',
    minOrder: 18,
  },
  {
    id: 5,
    name: 'Green Bowl',
    image: '/restaurant5.jpg',
    rating: 4.5,
    cuisine: 'Healthy',
    deliveryTime: '20-35',
    minOrder: 12,
  },
];

const FeaturedRestaurants = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Featured Restaurants
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the best restaurants in your area with amazing offers and lightning-fast delivery
          </p>
        </motion.div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="restaurant-swiper"
        >
          {restaurants.map((restaurant) => (
            <SwiperSlide key={restaurant.id}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg shadow-md">
                    <span className="text-orange-500">★</span>
                    <span className="ml-1 font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>🕒 {restaurant.deliveryTime} mins</span>
                    <span>Min. ${restaurant.minOrder}</span>
                  </div>
                  <button className="w-full mt-4 btn btn-primary">
                    View Menu
                  </button>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .restaurant-swiper {
          padding: 20px 10px 40px;
        }
        :global(.swiper-pagination-bullet-active) {
          background-color: #f97316 !important;
        }
        :global(.swiper-button-next),
        :global(.swiper-button-prev) {
          color: #f97316 !important;
        }
      `}</style>
    </section>
  );
};

export default FeaturedRestaurants; 