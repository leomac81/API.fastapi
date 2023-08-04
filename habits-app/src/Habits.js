import React, { useEffect,useState } from 'react';
import axios from 'axios';
import './Habits.css';
import { CreateHabit } from './CreateHabits';
import { Link } from 'react-router-dom';

export const Habits = ({ habits, setHabits, isLoggedIn, userEmail }) => {
    const [toBeDeleted, setToBeDeleted] = useState([]);
    
    useEffect(() => {
        const fetchHabits = async () => {
            try {
              if (userEmail) {
                const response = await axios.get(`http://127.0.0.1:8000/habits/${userEmail}`, {
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

    return (
        <div className="habits-container">
            
            <h1>Your Habits</h1>
            {habits.map(habit => (
                
                <div className="habit-box" key={habit.id}>
                    
                    <h3>{habit.habit_description}</h3>
                    <p>Frequency: {habit.frequency}</p>
                    <p>End Goal: {habit.end_goal}</p>
                    <p>End Date: {new Date(habit.end_date).toLocaleDateString()}</p>
                    <p>Completions: {habit.completions.length}</p>
                    <Link className="complete-habit-btn" to={`/habit/gethabits/${habit.id}`}>Complete your habit</Link>
                    <button onClick={() => handleDelete(habit.id)}>
                        {toBeDeleted.includes(habit.id) ? 'Are you sure?' : 'Delete Habit'}
                    </button>
                </div>
            ))}
        </div>
    );
}