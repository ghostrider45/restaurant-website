import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const ProtectedRestaurantRoute = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [isRestaurantOwner, setIsRestaurantOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isLoaded) return;
      
      if (!isSignedIn) {
        setIsRestaurantOwner(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user exists in restaurants collection
        const restaurantDocRef = doc(db, 'restaurants', user.id);
        const restaurantDoc = await getDoc(restaurantDocRef);
        
        setIsRestaurantOwner(restaurantDoc.exists());
        setLoading(false);
      } catch (error) {
        console.error('Error checking user role:', error);
        setIsRestaurantOwner(false);
        setLoading(false);
      }
    };

    checkUserRole();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/restaurant/sign-in" replace />;
  }

  if (!isRestaurantOwner) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRestaurantRoute;
