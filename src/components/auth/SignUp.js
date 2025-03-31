import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const SignUp = ({ userType }) => {
  const navigate = useNavigate();

  const handleSignUpComplete = async (user) => {
    if (userType === 'restaurant') {
      const restaurantData = {
        id: user.id,
        name: user.firstName + ' ' + user.lastName,
        email: user.emailAddresses[0].emailAddress,
        phone: user.phoneNumbers[0]?.phoneNumber || '',
        isVerified: false,
        isProfileComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        // Save initial data to Firestore
        await setDoc(doc(db, 'restaurants', user.id), restaurantData);
        
        // Navigate to profile setup
        navigate('/restaurant/profile-setup');
      } catch (error) {
        console.error('Error saving restaurant data:', error);
        alert('Failed to complete registration. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-500/20 to-transparent rounded-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-[480px] mx-auto px-4 py-8">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="mb-8 flex items-center text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors"
        >
          <span>← Back to Home</span>
        </motion.button>

        <ClerkSignUp
          afterSignUpUrl={userType === 'restaurant' ? '/restaurant/profile-setup' : '/user'}
          signInUrl={userType === 'restaurant' ? '/restaurant/sign-in' : '/user/sign-in'}
          onSignUpComplete={handleSignUpComplete}
        />
      </div>
    </div>
  );
};

export default SignUp; 
