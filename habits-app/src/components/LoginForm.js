import React, { useState } from "react";
import axios from 'axios';

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('username', email); // FastAPI expects 'username', not 'email'
        formData.append('password', password);

        try {
            const response = await axios.post('https://leoapi.xyz/api/login', formData);
            
            // If request is successful, store the access token in local storage.
            localStorage.setItem('access_token', response.data.access_token);

            // Notify the parent that login was successful
            props.onLogin(email);

        } catch (errorMessage) {
            if (errorMessage.response && errorMessage.response.status === 403) {
              setErrorMessage('Invalid credentials. Please try again.');
            } else {
              // handle other errors
              console.error("An error occurred: ", errorMessage);
            }}

    }

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <label htmlFor="password">password</label>
                <input value={password} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Log In</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
        </div>
    )
}