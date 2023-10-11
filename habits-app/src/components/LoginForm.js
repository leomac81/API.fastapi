// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://leoapi.xyz/api/login', {
        username: email,
        password: password
      });
      localStorage.setItem('token', response.data.access_token);
      // Redirect or update UI as user is logged in
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleLogin}>
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
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
