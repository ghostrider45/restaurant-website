import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './context/ThemeContext';
import MainHome from './components/MainHome';
import UserHome from './components/UserHome';
import RestaurantHome from './components/RestaurantHome';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainHome />} />
            <Route path="/user" element={<UserHome />} />
            <Route path="/user/sign-in" element={<SignIn userType="user" />} />
            <Route path="/user/sign-up" element={<SignUp userType="user" />} />
            <Route path="/restaurant" element={<RestaurantHome />} />
            <Route path="/restaurant/sign-in" element={<SignIn userType="restaurant" />} />
            <Route path="/restaurant/sign-up" element={<SignUp userType="restaurant" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
