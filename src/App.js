import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainHome from './components/MainHome';
import UserHome from './components/UserHome';
import RestaurantHome from './components/RestaurantHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/user" element={<UserHome />} />
        <Route path="/restaurant" element={<RestaurantHome />} />
      </Routes>
    </Router>
  );
}

export default App;
