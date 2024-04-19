import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import Signup from '../components/Signup';
import MainScreen from '../components/MainScreen'; // You will need to create this

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/main" element={<MainScreen />} />
      <Route path="/" element={<Login />} /> {/* Default route */}
    </Routes>
  </Router>
);

export default AppRoutes;
