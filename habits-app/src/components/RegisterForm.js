// src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterForm.css';
import TopBar from './TopBar';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const newUser = {
      email: email,
      password: password
    };
    try {
      await axios.post('https://leoapi.xyz/api/users/', newUser);
      navigate('/'); // Redirecting to the login page after successful signup
    } catch (error) {
      setError('Failed to create account');
    }
  };

  return (
    <div className="signup-container">
      <TopBar />
      <h1>Welcome to HabiTrack!</h1>
      <form onSubmit={handleSignup} className="register-form">
        {error && <p>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="register">Signup</button>
        <button type="returntologin" onClick={() => navigate('/')}>Login here</button>
      </form>
    </div>
  );
};

export default Signup;
