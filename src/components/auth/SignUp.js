import React, { useCallback, useEffect } from 'react';
import { SignUp as ClerkSignUp, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const SignUp = ({ userType }) => {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  // Create a memoized version of handleUserCreation to use in the useEffect dependency array
  const handleUserCreation = useCallback(async (userData) => {
    if (!userData) return;
    
    console.log('Creating user in Firebase:', userData.id);
    
    try {
      if (userType === 'restaurant') {
        // Restaurant data
        const restaurantData = {
          id: userData.id,
          role: 'restaurant',
          name: userData.firstName + ' ' + userData.lastName,
          email: userData.emailAddresses[0].emailAddress,
          phone: userData.phoneNumbers[0]?.phoneNumber || '',
          isVerified: false,
          isProfileComplete: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        console.log('Saving restaurant data to Firestore:', restaurantData);
        // Save restaurant data to Firestore
        await setDoc(doc(db, 'restaurants', userData.id), restaurantData);
        console.log('Restaurant data saved successfully');
        
        // Navigate to profile setup
        navigate('/restaurant/profile-setup');
      } else {
        // Customer data
        const customerData = {
          id: userData.id,
          role: 'customer',
          name: userData.firstName + ' ' + userData.lastName,
          email: userData.emailAddresses[0].emailAddress,
          phone: userData.phoneNumbers[0]?.phoneNumber || '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        console.log('Saving customer data to Firestore:', customerData);
        // Save customer data to Firestore
        await setDoc(doc(db, 'customers', userData.id), customerData);
        console.log('Customer data saved successfully');
        
        // Navigate to user home
        navigate('/user');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('Failed to complete registration. Please try again.');
    }
  }, [userType, navigate]);
  
  // Handle user creation in Firebase when Clerk sign-up is complete
  useEffect(() => {
    const saveUserToFirebase = async () => {
      if (!isSignedIn || !user) return;
      
      console.log('User is signed in, checking if we need to save to Firebase');
      
      // Check if we're on the sign-up page and user just completed sign-up
      if (window.location.pathname.includes('/sign-up')) {
        await handleUserCreation(user);
      }
    };
    
    saveUserToFirebase();
  }, [isSignedIn, user, handleUserCreation]);

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

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          {userType === 'restaurant' ? 'Register Your Restaurant' : 'Create Your Account'}
        </h1>

        <ClerkSignUp
          signInUrl={userType === 'restaurant' ? '/restaurant/sign-in' : '/user/sign-in'}
          afterSignUpUrl={userType === 'restaurant' ? '/restaurant/profile-setup' : '/user'}
        />
      </div>
    </div>
  );
};

export default SignUp;
