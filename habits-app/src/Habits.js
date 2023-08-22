import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Habits.css';
import { Link } from 'react-router-dom';
import HabitCompletionGrid from './HabitCompletionGrid.js';

export const Habits = ({ habits, setHabits, isLoggedIn, userEmail, setLastUpdate}) => {
    const [toBeDeleted, setToBeDeleted] = useState([]);

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                if (userEmail) {
                    const response = await axios.get(`http://127.0.0.1:8000/habits/email/${userEmail}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    setHabits(response.data);
                }
            } catch (error) {
                console.error("An error occurred while trying to fetch the user's habits: ", error);
            }
        };

        if (isLoggedIn) {
            fetchHabits();
        }
    }, [isLoggedIn, userEmail, setHabits]);




    const handleDelete = async (id) => {
        if (toBeDeleted.includes(id)) {
            try {
                await axios.delete(`http://127.0.0.1:8000/habits/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Filter out the deleted habit
                const updatedHabits = habits.filter(habit => habit.id !== id);
                setHabits(updatedHabits);
                setLastUpdate(Date.now());
                // Remove id from toBeDeleted array
                const updatedToBeDeleted = toBeDeleted.filter(habitId => habitId !== id);
                setToBeDeleted(updatedToBeDeleted);
            } catch (error) {
                console.error("An error occurred while trying to delete the habit: ", error);
            }
        } else {
            setToBeDeleted([...toBeDeleted, id]);
        }
    };
    const dateToKey = date => new Date(date).toISOString().split('T')[0];
    return (
        <div className="habits-container">
            
            <h2>Your Habits</h2>
            {habits.map(habit => {
                // Create a lookup object from the completions array
                const completionLookup = habit.completions.reduce((lookup, completion) => {
                    lookup[dateToKey(completion.date)] = completion.completed;
                    return lookup;
                }, {});

                // Generate an array for the last 14 days
                let completionsWithRemaining = Array.from({ length: 14 }, (_, i) => {
                    // Calculate the date for this index
                    let date = new Date();
                    date.setDate(date.getDate() - (14 - 1 - i));
                    // If a completion exists for this date, return it. Otherwise, return false.
                    return completionLookup[dateToKey(date)] || false;
                });
                return (

                    <div className="habit-box" key={habit.id}>
                        <h3>{habit.habit_description}</h3>
                        <p>Frequency: {habit.frequency}</p>
                        <p>End Goal: {habit.end_goal}</p>
                        <p>End Date: {new Date(habit.end_date).toLocaleDateString()}</p>
                        <HabitCompletionGrid completions={completionsWithRemaining} />

                        <Link className="complete-habit-btn" to={`/habit/gethabits/${habit.id}`}>Complete your habit</Link>
                        <button className="delete-habit-btn" onClick={() => handleDelete(habit.id)}>
                            {toBeDeleted.includes(habit.id) ? 'Are you sure?' : 'Delete Habit'}
                        </button>

                    </div>
                );
            })}
        </div>
    );
}