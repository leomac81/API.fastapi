import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FetchPublicHabits.css';  // Assuming you have a CSS for this component
import HabitCompletionGrid from './HabitCompletionGrid.js';
import  CreateHabit  from './CreateHabits';

export const FetchPublicHabits = ({lastUpdate}) => {
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        // Fetch public habits on component mount
        const fetchPublicHabits = async () => {
            try {
                const response = await axios.get('https://www.leoapi.xyz/habits/public/all', {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                      'Content-Type': 'application/json'
                    }
                  });
                setHabits(response.data);
            } catch (error) {
                console.error("An error occurred while fetching habits: ", error);
            }
        };

        fetchPublicHabits();
    }, [lastUpdate]);
    const dateToKey = date => new Date(date).toISOString().split('T')[0];
    return (
        <div className="fetch-public-habits-container">
            <h2>Public Habits</h2>
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
            <div className="public-habits-box">
                    <div key={habit.id} className="public-habit-item">
                        <h3>{habit.habit_description}</h3>
                        <p>Frequency: {habit.frequency}</p>
                        <p>End Goal: {habit.end_goal}</p>
                        <p>End Date: {new Date(habit.end_date).toLocaleDateString()}</p>
                        <HabitCompletionGrid completions={completionsWithRemaining} />
                    </div>
            </div>
            );
        })}
        </div>
    );
}
