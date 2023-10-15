// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link} from 'react-router-dom';
import './LoginForm.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData();
        formData.append('username', email); // FastAPI expects 'username', not 'email'
        formData.append('password', password);
    try {
      const response = await axios.post('https://leoapi.xyz/api/login', formData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userEmail', email);
      navigate('/homepage'); 
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
      <Link to="/signup">Create an Account</Link>
    </form>
  );
};

export default Login;