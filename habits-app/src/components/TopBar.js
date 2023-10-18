// src/components/TopBar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './TopBar.css';

const TopBar = () => {
    const navigate = useNavigate();
    const isAuthenticated = Boolean(localStorage.getItem('token'));

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/');
    };

    return (
        <div className="top-bar">
            {isAuthenticated ? (
                <>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                    <Link to="/homepage" className="logo-container">
                        <img src={logo} alt="Your App Name" className="logo"/>
                    </Link>
                </>
            ) : (
                <div className="logo-container">
                    <img src={logo} alt="Your App Name" className="logo"/>
                </div>
            )}
        </div>
    );
};

export default TopBar;
