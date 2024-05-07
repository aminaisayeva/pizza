// src/components/Signup.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { createUserProfileDocument } from '../services/FirestoreService';
import { UserContext } from '../context/UserContext'; // Corrected import for context
import BackButton from './BackButton';
import '../styles/Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Assuming UserContext provides setUser

  const handleSignup = async (event) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      alert("Passwords don't match.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a profile document for the user in Firestore
      await createUserProfileDocument(user.uid, { email });

      // Update user context with the new user data
      setUser({
        uid: user.uid,
        email: user.email,
        // include other user details you want to set in context
      });

      navigate('/main');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signup">
      <BackButton /> {/* Add the back button */}
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Repeat password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
        <button className="signup-butt">Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
