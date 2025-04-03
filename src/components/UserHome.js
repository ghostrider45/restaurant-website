import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import CustomerDashboard from './customer/CustomerDashboard';

const UserHome = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        console.log('User not signed in, redirecting to sign-in page');
        navigate('/user/sign-in');
        return;
      }

      console.log('Checking user role for user ID:', user.id);

      try {
        // Check if user exists in customers collection
        const customerDocRef = doc(db, 'customers', user.id);
        console.log('Checking customer document at path:', customerDocRef.path);

        const customerDoc = await getDoc(customerDocRef);
        console.log('Customer document exists:', customerDoc.exists());

        // Check if user exists in restaurants collection
        const restaurantDocRef = doc(db, 'restaurants', user.id);
        const restaurantDoc = await getDoc(restaurantDocRef);

        if (restaurantDoc.exists()) {
          // If user is a restaurant owner, they should use the restaurant interface
          console.log('User is a restaurant owner, suggesting to use restaurant interface');
          // We'll just log this but not redirect, to allow restaurant owners to browse as users too
        }

        if (!customerDoc.exists()) {
          console.log('User is not yet in customers collection, adding them');
          // If user is not in customers collection, add them
          const customerData = {
            id: user.id,
            role: 'customer',
            name: user.fullName || '',
            email: user.primaryEmailAddress?.emailAddress || '',
            phone: user.primaryPhoneNumber?.phoneNumber || '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            isVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          await setDoc(doc(db, 'customers', user.id), customerData);
          console.log('Added user to customers collection');
        } else {
          console.log('User is a customer, data:', customerDoc.data());
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    checkUserRole();
  }, [isLoaded, isSignedIn, user, navigate]);

  if (!isLoaded || !isSignedIn) {
    return null; // Return nothing while checking auth to avoid flash
  }

  return <CustomerDashboard />;
};

export default UserHome;