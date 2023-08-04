
import React, { useState, useEffect } from "react";
import axios from 'axios';
import './App.css';
import { Login } from "./Login";
import { Register } from "./Register";
import { Habits } from "./Habits";
import { CreateHabit } from "./CreateHabits";
import { TopBar } from './TopBar';
import { HabitCompletionPage } from "./HabitCompletionPage";
import { BrowserRouter as Router, Routes, Route, Navigate,useNavigate } from 'react-router-dom';

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
    return (
      <div className="App">
          {isLoggedIn && <TopBar title="Habit Tracker" onLogout={handleLogout} />}
          <Routes>
              <Route path="/habit/gethabits/:habitId" element={<HabitCompletionPage />} />

              <Route path="/login" element={<Login onFormSwitch={toggleForm} onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onFormSwitch={toggleForm} />} />
              <Route path="/" element={
                isLoggedIn ? (
                  <>
                    <Habits habits={habits} setHabits={setHabits} isLoggedIn={isLoggedIn} userEmail={userEmail} />
                    <CreateHabit habits={habits} setHabits={setHabits} />
                  </>
                ) : (
                  currentForm === "login" ? 
                    <Navigate to="/login" replace /> :
                    <Navigate to="/register" replace />
                )
              } />
          </Routes>
      </div>
  );
}

export default App;
