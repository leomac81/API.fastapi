import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecentHabits = () => {
    const [recentHabits, setRecentHabits] = useState([]);

    const fetchRecentHabits = async () => {
        try {
            const response = await axios.get('https://leoapi.xyz/api/habits/public/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setRecentHabits(response.data);
        } catch (error) {
            console.error("Failed to fetch recent habits:", error);
        }
    };

    useEffect(() => {
        fetchRecentHabits();
    }, []); 

    return (
        <div>
            <h2>Recent Habits</h2>
            <ul>
                {recentHabits.map(habit => (
                    <li key={habit.id}>{habit.habit_description}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecentHabits;
