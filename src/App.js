import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import MainHome from './components/MainHome';
import UserHome from './components/UserHome';
import RestaurantHome from './components/RestaurantHome';
import ProfileSetup from './components/restaurant/ProfileSetup';
import Dashboard from './components/restaurant/Dashboard';
import EditProfile from './components/restaurant/EditProfile';
import Menu from './components/restaurant/menu/Menu';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainHome />} />
              <Route path="/user" element={<UserHome />} />
              <Route path="/user/sign-in" element={<SignIn userType="user" />} />
              <Route path="/user/sign-up" element={<SignUp userType="user" />} />
              <Route path="/restaurant" element={<RestaurantHome />} />
              <Route path="/restaurant/profile-setup" element={<ProfileSetup />} />
              <Route path="/restaurant/dashboard" element={<Dashboard />} />
              <Route path="/restaurant/edit-profile" element={<EditProfile />} />
              <Route path="/restaurant/menu" element={<Menu />} />
              <Route path="/restaurant/sign-in" element={<SignIn userType="restaurant" />} />
              <Route path="/restaurant/sign-up" element={<SignUp userType="restaurant" />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;
