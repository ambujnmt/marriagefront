// Login.js
import React, { useState, useEffect } from 'react';
import './login.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/dashboard');
        }
    }, [navigate]);

    // Toggle password visibility
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Handle login submit
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const loginData = {
            email: email,
            password: password
        };

        try {
            const response = await axios.post(
                'https://site2demo.in/marriageapp/api/login',
                loginData
            );

            console.log("Login response:", response.data);

            if (response.data.status === true) {
                const user = response.data.users;

                // ✅ Store login info
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user_id', user.id); // Store user_id for profile use

                // ✅ Notify AppWrapper
                if (onLogin) {
                    onLogin();
                }

                toast.success('Login Successful!', {
                    position: 'top-right',
                    autoClose: 3000,
                });

                navigate('/dashboard');
            } else {
                // API returned status false
                setErrorMessage(response.data.message || 'Login failed');
                toast.error(response.data.message || 'Login failed', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Login Error:', error);

            const serverError = error.response?.data?.message || 'Login failed. Please try again.';
            setErrorMessage(serverError);
            toast.error(serverError, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="login-container">
            <div className="form-side">
                <h2>Login</h2>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group password-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="eye-icon" onClick={togglePassword}>
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                    </div>

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
