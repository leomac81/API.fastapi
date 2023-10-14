// src/components/Homepage.js
import React, { useState } from 'react';
import HabitList from './HabitList';
import CreateHabit from './CreateHabit';
import RecentHabits from './RecentHabits';

const Homepage = () => {
    const userEmail = localStorage.getItem('userEmail');
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshHabits = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
      <div>
        <h1>Create and track your habits here</h1>
        <HabitList userEmail={userEmail} refreshKey={refreshKey} />
        <CreateHabit onHabitCreated={refreshHabits} />
        <RecentHabits />
      </div>
    );
  };
  
  export default Homepage;