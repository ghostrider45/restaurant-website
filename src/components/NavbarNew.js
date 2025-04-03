import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import DarkModeToggle from './DarkModeToggle';

const NavbarNew = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isSignedIn || !user) return;

      try {
        // Check if user exists in restaurants collection
        const restaurantDoc = await getDoc(doc(db, 'restaurants', user.id));
        if (restaurantDoc.exists()) {
          setUserRole('restaurant');
          return;
        }

        // Check if user exists in customers collection
        const customerDoc = await getDoc(doc(db, 'customers', user.id));
        if (customerDoc.exists()) {
          setUserRole('customer');
          return;
        }

        setUserRole(null);
      } catch (error) {
        console.error('Error checking user role:', error);
        setUserRole(null);
      }
    };

    checkUserRole();
  }, [isSignedIn, user]);

  const handleSignOut = () => {
    signOut().then(() => {
      navigate('/');
    });
  };

  // Determine if we're on a restaurant page or user page
  const isRestaurantPage = location.pathname.startsWith('/restaurant');
  const isUserPage = location.pathname.startsWith('/user');

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-orange-500">
              FoodExpress
            </Link>

            {/* Search Bar - Only show on certain pages */}
            {(location.pathname === '/user/order-food' || location.pathname.startsWith('/user/restaurant/')) && (
              <div className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Search for food or restaurants..."
                  className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {userRole === 'customer' && (
              <>
                <Link to="/user" className={`text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 ${isUserPage && !location.pathname.includes('/user/') ? 'text-orange-500 dark:text-orange-400' : ''}`}>
                  Dashboard
                </Link>
                <Link to="/user/order-food" className={`text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 ${location.pathname === '/user/order-food' ? 'text-orange-500 dark:text-orange-400' : ''}`}>
                  Order Food
                </Link>
                <Link to="/user/orders" className={`text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 ${location.pathname === '/user/orders' ? 'text-orange-500 dark:text-orange-400' : ''}`}>
                  My Orders
                </Link>
              </>
            )}

            {userRole === 'restaurant' && (
              <>
                <Link to="/restaurant" className={`text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 ${isRestaurantPage && !location.pathname.includes('/restaurant/') ? 'text-orange-500 dark:text-orange-400' : ''}`}>
                  Dashboard
                </Link>
                <Link to="/restaurant/menu" className={`text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 ${location.pathname === '/restaurant/menu' ? 'text-orange-500 dark:text-orange-400' : ''}`}>
                  Menu
                </Link>
                <Link to="/restaurant/orders" className={`text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 ${location.pathname === '/restaurant/orders' ? 'text-orange-500 dark:text-orange-400' : ''}`}>
                  Orders
                </Link>
              </>
            )}

            {!isSignedIn && (
              <>
                <Link to="/about" className="text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                  About
                </Link>
                <Link to="/contact" className="text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                  Contact
                </Link>
              </>
            )}

            <DarkModeToggle />

            {isSignedIn ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                  <span>{user.firstName}</span>
                  <img
                    src={user.imageUrl || 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  {userRole === 'customer' && (
                    <Link to="/user/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">
                      My Profile
                    </Link>
                  )}
                  {userRole === 'restaurant' && (
                    <Link to="/restaurant/edit-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">
                      Restaurant Profile
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/user/sign-in"
                  className="text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
                >
                  Sign In
                </Link>
                <Link
                  to="/user/sign-up"
                  className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            {userRole === 'customer' && (
              <>
                <Link to="/user" className="block text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                  Dashboard
                </Link>
                <Link to="/user/order-food" className="block text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                  Order Food
                </Link>
                <Link to="/user/orders" className="block text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                  My Orders
                </Link>
              </>
            )}

            {userRole === 'restaurant' && (
              <>
                <Link to="/restaurant" className="block text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                  Dashboard
                </Link>
                <Link to="/restaurant/menu" className="block text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                  Menu
                </Link>
                <Link to="/restaurant/orders" className="block text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                  Orders
                </Link>
              </>
            )}

            {!isSignedIn && (
              <>
                <Link to="/about" className="block text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                  About
                </Link>
                <Link to="/contact" className="block text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                  Contact
                </Link>
              </>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <DarkModeToggle />
            </div>

            {isSignedIn ? (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.imageUrl || 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-600 dark:text-gray-300">{user.firstName}</span>
                </div>
                {userRole === 'customer' && (
                  <Link to="/user/profile" className="block text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                    My Profile
                  </Link>
                )}
                {userRole === 'restaurant' && (
                  <Link to="/restaurant/edit-profile" className="block text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400">
                    Restaurant Profile
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="block text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-2">
                <Link
                  to="/user/sign-in"
                  className="text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
                >
                  Sign In
                </Link>
                <Link
                  to="/user/sign-up"
                  className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors inline-block text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarNew;
