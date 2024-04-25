import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from '../context/UserContext';
import logoutButtonImage from '../assets/exit_button.png'; // Ensure you have the correct path to your image

const LogoutButton = () => {
  const { signOutUser } = useContext(UserContext);
  const navigate = useNavigate(); // Now useNavigate is called within a component wrapped by <Router>

  const handleLogout = async () => {
    await signOutUser();
    navigate('/'); // Navigate to the welcome screen after logout
  };

  return (
    <button onClick={handleLogout} style={{ background: `url(${logoutButtonImage}) no-repeat center/cover`, border: 'none', width: '150px', height: '150px', cursor: 'pointer' }} className="logout-button">
      Log Out
    </button>
  );
};

export default LogoutButton;
