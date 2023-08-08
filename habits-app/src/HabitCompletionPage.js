import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './HabitCompletionPage.css';

export const HabitCompletionPage = () => {
  const { habitId } = useParams();
  const [habit, setHabit] = useState(null);
  const [completionError, setCompletionError] = useState(null);

  const fetchHabit = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/habits/${habitId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      setHabit(response.data);
    } catch (error) {
      console.error("An error occurred while trying to fetch the habit: ", error);
    }
  };

  useEffect(() => {
    fetchHabit();
  }, [habitId]);

  const addCompletion = async (completionData) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/habits/${habitId}/completion`, completionData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Fetch the habit again to get the updated list of completions
        fetchHabit();
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setCompletionError('A completion for this habit already exists for this period.');
      } else {
        console.error("An error occurred: ", error);
      }
  }
  };

  const handleCompletionFormSubmit = (event) => {
    event.preventDefault();
    const completed = event.target.elements.completed.checked;
    const comment = event.target.elements.comment.value;
    const date = new Date().toISOString().split('T')[0];
    
    
    addCompletion({ comment, completed,date });
  };

  // The page will show a loading message while the habit is being fetched
  if (!habit) {
    return <div>Loading...</div>;
  }

  return (
    <div className="habit-completion-page">
      <h1>{habit.habit_description}</h1>
      <form onSubmit={handleCompletionFormSubmit}>
        <input type="checkbox" name="completed" id="completed" />
        <label htmlFor="completed">Completed</label>
        <input type="text" name="comment" id="comment" placeholder="Comment" />
        <button type="submit">Add Completion</button>
      </form>
      {completionError && <p className="error-banner">{completionError}</p>}
    </div>
    
  );
};
