import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    image: '/testimonial1.jpg',
    role: 'Food Blogger',
    comment:
      'The variety of restaurants and the quality of food is amazing. The delivery is always on time and the food arrives hot!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    image: '/testimonial2.jpg',
    role: 'Regular Customer',
    comment:
      'I love how easy it is to order food. The app is very user-friendly and the customer service is excellent.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Davis',
    image: '/testimonial3.jpg',
    role: 'Food Enthusiast',
    comment:
      'Great selection of restaurants and the delivery drivers are always professional. Highly recommended!',
    rating: 4,
  },
  {
    id: 4,
    name: 'David Wilson',
    image: '/testimonial4.jpg',
    role: 'Food Critic',
    comment:
      "The best food delivery service I've used. The restaurants are high-quality and the service is reliable.",
    rating: 5,
  },
];

const Testimonials = () => {
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
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read what our satisfied customers have to say about their experience
          </p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg p-8 h-full"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{testimonial.comment}</p>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <span key={index} className="text-orange-500">
                      ★
                    </span>
                  ))}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .testimonials-swiper {
          padding: 20px 10px 60px;
        }
        :global(.swiper-pagination-bullet-active) {
          background-color: #f97316 !important;
        }
      `}</style>
    </section>
  );
};

export default Testimonials; 