// src/components/HabitList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CompletionGrid from './CompletionGrid';
import './HabitList.css'

const HabitList = ({ userEmail, refreshKey }) => {
  const [habits, setHabits] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHabits = async () => {
      if (!userEmail) { // Check if userEmail is valid
        setError('User email is not available');
        return; // Exit function if not
      }
      try {
        const response = await axios.get(`https://leoapi.xyz/api/habits/email/${userEmail}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store token in LocalStorage
          }
        });
        setHabits(response.data);
      } catch (error) {
        setError('Failed to fetch habits');
      }
    };
    fetchHabits();
  }, [userEmail, refreshKey]); // Fetching habits when userEmail changes

  return (
    <div>
      <h1>Your Habits</h1>
      {error && <p className="error">{error}</p>}
      {habits.length === 0 && <p>No habits found. Start by adding a new one!</p>}
      <div className="habitsContainer">
        {habits.map((habit) => (
          <Link to={`/habits/${habit.id}`} key={habit.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="habitCard">
              <h2>{habit.habit_description}</h2>
              <p>End Goal: {habit.end_goal}</p>
              <p>Frequency: {habit.frequency}</p>
              <p>End Date: {new Date(habit.end_date).toLocaleDateString()}</p>
              {habit && <CompletionGrid habit={habit} />}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HabitList;
