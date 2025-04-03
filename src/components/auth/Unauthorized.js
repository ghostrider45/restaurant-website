import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [userRole, setUserRole] = React.useState(null);

  React.useEffect(() => {
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

  const handleGoHome = () => {
    if (userRole === 'restaurant') {
      navigate('/restaurant');
    } else if (userRole === 'customer') {
      navigate('/user');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
      >
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Unauthorized Access</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You don't have permission to access this page. Please sign in with the appropriate account.
        </p>
        <div className="space-x-4">
          <button
            onClick={handleGoHome}
            className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
