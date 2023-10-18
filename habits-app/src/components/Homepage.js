// src/components/Homepage.js
import React, { useState, useEffect } from 'react';
import HabitList from './HabitList';
import CreateHabit from './CreateHabit';
import RecentHabits from './RecentHabits';
import TopBar from './TopBar';
import Dropdown from './Dropdown';
import './Homepage.css'

const Homepage = () => {
    const userEmail = localStorage.getItem('userEmail');
    const [refreshKey, setRefreshKey] = useState(0);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);

    useEffect(() => {
      const handleResize = () => {
        setIsMobileView(window.innerWidth < 1000);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    const refreshHabits = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    const renderContent = (title, Component, props) => {
      return isMobileView ? (
        <Dropdown title={title}>
          <Component {...props} />
        </Dropdown>
      ) : (
        <div className={`content-section ${title.toLowerCase().replace(' ', '-')}`}>
          <Component {...props} />
        </div>
      );
    };

    return (
    <div className="homepage">
      <TopBar />
      <h1>Create and track your habits here</h1>
      <div className="content">
        {renderContent('User Habits', HabitList, { userEmail, refreshKey })}
        {renderContent('Public Habits', RecentHabits)}
        {renderContent('Create Habit', CreateHabit, { onHabitCreated: refreshHabits })}
      </div>
    </div>
  );
  };
  
  export default Homepage;