import React, { useState } from "react";
import axios from 'axios';

export const Register = (props) => { // remove async here
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');


    const handleSubmit = async (e) => { // add async here
        e.preventDefault();
        
        try {
            const response = await axios.post('https://leoapi.xyz/api/users/', { 
                email: email, 
                password: password 
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        // check if the registration was successful
        if (response.status === 201 || response.status === 200) {
            // If successful, switch back to the login form
            props.onFormSwitch('login');
        }
            
        } catch (error) {
            console.error("An error occurred while trying to create a new user: ", error);
        }
    }

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="email">email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
            <label htmlFor="password">password</label>
            <input value={password} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
            <button type="submit">Register</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here.</button>
    </div>
    )
}