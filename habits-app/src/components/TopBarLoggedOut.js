// src/components/TopBar.js
import React from 'react';
import './TopBarLoggedOut.css';
import logo from '../assets/logo.png';

const TopBarLoggedOut = () => {
    return (
        <div className="top-bar-logged-out">
            <img src={logo} alt="Your App Name" className="logo"/>
        </div>
    );
};

export default TopBarLoggedOut;
