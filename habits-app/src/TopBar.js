import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';

export const TopBar = ({ title, onLogout }) => {
    let navigate = useNavigate();

    const handleBack = () => {
        // Assuming that '/habits' is the path that displays all the habits.
        navigate('/');
    };

    return (
        <div className="top-bar">
            <h1>{title}</h1>
            <button onClick={handleBack}>Back</button>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}
