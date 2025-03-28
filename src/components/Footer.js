import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerLinks = {
    company: ['About Us', 'Careers', 'Partner with us', 'Blog'],
    support: ['Help Center', 'Safety', 'Terms of Service', 'Privacy Policy'],
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    contact: ['Email: support@foodie.com', 'Phone: (555) 123-4567', 'Address: 123 Food Street'],
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <motion.img
              src="/logo-white.png"
              alt="Foodie Logo"
              className="h-12 w-auto mb-6"
              whileHover={{ scale: 1.05 }}
            />
            <p className="text-gray-400 mb-6">
              Delivering happiness to your doorstep. Order your favorite food from the best restaurants in town.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <motion.a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, color: '#f97316' }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className={`fab fa-${social} text-xl`}></i>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white text-lg font-semibold mb-4 capitalize">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <motion.li
                    key={link}
                    whileHover={{ x: 5 }}
                    className="text-gray-400"
                  >
                    <a
                      href="#"
                      className="hover:text-orange-500 transition-colors"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white text-xl font-semibold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-gray-400 mb-6">
              Get the latest updates about new restaurants and exclusive offers
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>© {new Date().getFullYear()} Foodie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 