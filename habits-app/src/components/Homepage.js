// src/components/Homepage.js
import React, { useState } from 'react';
import HabitList from './HabitList';
import CreateHabit from './CreateHabit';
import RecentHabits from './RecentHabits';
import TopBar from './TopBar';
import './Homepage.css'
const Homepage = () => {
    const userEmail = localStorage.getItem('userEmail');
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshHabits = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
      <div className="homepage">
        <TopBar />
        <h1>Create and track your habits here</h1>
        <div className="content">
            <div className="user-habits">
                <HabitList userEmail={userEmail} refreshKey={refreshKey} />
            </div>
            <div className="public-habits">
                <RecentHabits />
            </div>
            <div className="create-habit">
                <CreateHabit onHabitCreated={refreshHabits} />
            </div>
        </div>
      </div>
    );
  };
  
  export default Homepage;