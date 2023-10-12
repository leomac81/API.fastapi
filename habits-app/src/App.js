
import React, { useState } from "react";
import './App.css';
import { Login } from "./LoginForm";
import { Register } from "./RegisterForm";
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
      {isLoggedIn && <TopBar title="Habit Tracker" onLogout={handleLogout} />}
      <Routes>
        <Route path="/habit/gethabits/:habitId" element={<HabitCompletionPage />} />

        <Route path="/login" element={<Login onFormSwitch={toggleForm} onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onFormSwitch={toggleForm} />} />
        <Route path="/" element={
          isLoggedIn ? (
            <>
              <div className="habits-layout">
                <Habits habits={habits} setHabits={setHabits} isLoggedIn={isLoggedIn} userEmail={userEmail} setLastUpdate={setLastUpdate}/>
                <FetchPublicHabits lastUpdate={lastUpdate}/>
                <CreateHabit habits={habits} setHabits={setHabits} setLastUpdate={setLastUpdate}/>
              </div>
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