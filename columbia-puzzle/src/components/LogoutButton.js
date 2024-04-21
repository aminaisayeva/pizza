import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from '../context/UserContext';

const LogoutButton = () => {
  const { signOutUser } = useContext(UserContext);
  const navigate = useNavigate(); // Now useNavigate is called within a component wrapped by <Router>

  const handleLogout = async () => {
    await signOutUser();
    navigate('/'); // Navigate to the welcome screen after logout
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Log Out
    </button>
  );
};

export default LogoutButton;
