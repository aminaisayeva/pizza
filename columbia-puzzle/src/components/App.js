import React from 'react';
import AppRoutes from '../routes/AppRoutes'; // Ensure this path is correct
import '../styles/App.css';
import { UserProvider } from '../context/UserContext'; // Ensure this path is correct

function App() {
  return (
    <UserProvider> {/* Wrap your routes within UserProvider */}
      <div className="App">
        <AppRoutes />
      </div>
    </UserProvider>
  );
}

export default App;
