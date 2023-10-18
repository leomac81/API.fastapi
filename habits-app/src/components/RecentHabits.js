import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CompletionGrid from './CompletionGrid';
import './RecentHabits.css'

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
            <h1>Recent Habits</h1>
            <div className="recentHabitsContainer">
            <ul>
                {recentHabits.map(habit => (
                    <div key={habit.id} className="habitCard">
                        <li>{habit.habit_description}</li>
                        <CompletionGrid habit={habit} />
                    </div>
                ))}
            </ul>
            </div>
        </div>
        
    );
};

export default RecentHabits;
