// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/LoginForm';
import Signup from './components/RegisterForm';
import Homepage from './components/Homepage';
import HabitPage from './components/HabitPage';
import TopBar from './components/TopBar';
import './App.css';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/habits/:habitId" element={<HabitPage />} />
      </Routes>
  );
}

export default App;