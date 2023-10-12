
import React, { useState } from "react";
import './App.css';
import { Login } from "./components/LoginForm";
import { Register } from "./components/RegisterForm";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
  const [currentForm, setCurrentForm] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();
  const toggleForm = (formName) => {
    if (formName === 'login') {
      navigate('/login');
    } else if (formName === 'register') {
      navigate('/register');
    }
  }

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    navigate('/');
  }
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    navigate('/login');
  }
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  return (
    <div className="App">
      {
        currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />
      }
    </div>
  );
}

export default App;