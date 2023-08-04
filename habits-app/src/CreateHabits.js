import React, { useState } from 'react';
import axios from 'axios';
import './CreateHabits.css'
import { Habits } from './Habits';
export const CreateHabit = ({habits,setHabits}) => {
    const [habit, setHabit] = useState({
        public: 'yes',
        frequency: 'daily',
        habit_description: '',
        end_goal: '',
        end_date: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/habits/create_habit/', habit, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }});
                const newHabit = response.data;
                setHabits([...habits, newHabit]);

                
        } catch (error) {
            console.error("An error occurred: ", error);
        }
    };

    const handleChange = (e) => {
        setHabit({...habit, [e.target.name]: e.target.value });
    };

    return (
        <div className="create-habit-container">
            <h2>Create Habit</h2>
            <form className="create-habit-form" onSubmit={handleSubmit}>
                <label htmlFor="public">Public</label>
                <select name="public" onChange={handleChange}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                
                <label htmlFor="frequency">Frequency</label>
                <select name="frequency" onChange={handleChange}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>

                <label htmlFor="habit_description">Habit Description</label>
                <input type="text" name="habit_description" onChange={handleChange} />

                <label htmlFor="end_goal">End Goal</label>
                <input type="text" name="end_goal" onChange={handleChange} />

                <label htmlFor="end_date">End Date</label>
                <input type="date" name="end_date" onChange={handleChange} />

                <button type="submit">Create</button>
            </form>
        </div>
    )
}
