import React, { useState } from 'react';
import axios from 'axios';

function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://www.leoapi.xyz/users/', { 
                email: email, 
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                    // any other necessary headers
                }
            });

            // If the sign-up is successful, do something here. For instance, you might want to redirect the user to the login page.
            console.log(response.data);
        } catch (error) {
            console.error("An error occurred while trying to create a new user: ", error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input 
                    type="text" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                />
            </label>
            <br />
            <label>
                Password:
                <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                />
            </label>
            <br />
            <input type="submit" value="Sign Up" />
        </form>
    );
}

export default SignUpForm;
