import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CompletionGrid from './CompletionGrid';
import './HabitPage.css'

const HabitPage = () => {
    const { habitId } = useParams(); // Extract habitId from URL
    const navigate = useNavigate();
    const [habit, setHabit] = useState(null);
    const [comment, setComment] = useState('');
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState('')
    const currentDate = new Date().toISOString().split('T')[0];
    useEffect(() => {
        const fetchHabit = async () => {
            try {
                const response = await axios.get(`https://leoapi.xyz/api/habits/${habitId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setHabit(response.data);
            } catch (error) {
                setError('Failed to fetch habit');
            }
        };
        fetchHabit();
    }, [habitId]);

    const handleCompletion = async (event) => {
        event.preventDefault();
        try {
            await axios.post(`https://leoapi.xyz/api/habits/${habitId}/completion`, {
                comment,
                completed,
                date: currentDate
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Refresh habit data or provide user feedback...
            setComment('');
            setCompleted(true);
            setError(null);
            navigate('/homepage');
        } catch (error) {
            setError('Failed to add completion'+error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://leoapi.xyz/api/habits/${habitId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/homepage'); // Redirect to homepage after deletion
        } catch (error) {
            setError('Failed to delete habit');
        }
    };

    if (!habit) return <p>Loading...</p>;

    return (
        <div>
            <h1>{habit.habit_description}</h1>
            
            <form onSubmit={handleCompletion}>
                <label>
                    Comment:
                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
                </label>
                <label>
                    Completed:
                    <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
                </label>
                <button type="submit">Add Completion</button>
            </form>
            
            <button onClick={handleDelete}>Delete Habit</button>
            
            {error && <p>{error}</p>}
            {habit && <CompletionGrid habit={habit} />}
        </div>
    );
};

export default HabitPage;
