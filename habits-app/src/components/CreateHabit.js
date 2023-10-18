import React, { useState } from 'react';
import axios from 'axios';
import './CreateHabit.css'

const CreateHabit = ({onHabitCreated}) => {
  const [formData, setFormData] = useState({
    public: '',
    frequency: '',
    habit_description: '',
    end_goal: '',
    end_date: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://leoapi.xyz/api/habits/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setError('');
      setSuccess('Habit created successfully!');
      if(onHabitCreated) {
        onHabitCreated();
    }
    } catch (err) {
      setError('Failed to create habit');
    }
  };

  return (
    <div>
      <h1>Create a New Habit</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="public">Public:</label>
          <select name="public" onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label htmlFor="frequency">Frequency:</label>
          <select name="frequency" onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            {/* Add other options as per your needs */}
          </select>
        </div>
        <div>
          <label htmlFor="habit_description">Habit Description:</label>
          <input
            type="text"
            name="habit_description"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="end_goal">End Goal:</label>
          <input type="text" name="end_goal" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="end_date">End Date:</label>
          <input type="date" name="end_date" onChange={handleChange} required />
        </div>
        <button type="submit">Create Habit</button>
      </form>
    </div>
  );
};

export default CreateHabit;
