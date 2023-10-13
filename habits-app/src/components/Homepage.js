// src/components/Homepage.js
import React, { useState } from 'react';
import HabitList from './HabitList';
import CreateHabit from './CreateHabit';

const Homepage = () => {
    const userEmail = localStorage.getItem('userEmail');
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshHabits = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
      <div>
        <h1>Welcome to the Homepage</h1>
        <HabitList userEmail={userEmail} refreshKey={refreshKey} />
        <CreateHabit onHabitCreated={refreshHabits} />
      </div>
    );
  };
  
  export default Homepage;