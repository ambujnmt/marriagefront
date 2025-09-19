// Login.js
import React, { useState, useEffect } from 'react';
import './login.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// ✅ Accept onLogin prop
function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        const loginData = { email, password };

        try {
            const response = await axios.post('https://site2demo.in/marriageapp/api/login', loginData);

            if (response.data.status === true) {
                localStorage.setItem('isLoggedIn', 'true');
                onLogin(); // ✅ tell AppWrapper that login was successful
                toast.success('Login Successful!', {
                    position: 'top-right',
                    autoClose: 5000,
                });
                navigate('/dashboard');
            } else {
                if (response.data.message.includes('Email')) {
                    setErrorMessage('The email you entered doesn’t exist.');
                } else if (response.data.message.includes('password')) {
                    setErrorMessage('The password you entered is incorrect.');
                } else {
                    setErrorMessage(response.data.message || 'Login Failed! Please try again later.');
                }

                toast.error(response.data.message, {
                    position: 'top-right',
                    autoClose: 5000,
                });
            }
        } catch (error) {
            setErrorMessage('Login Failed! Please check your credentials.');
            toast.error('Login Failed! Please check your credentials.', {
                position: 'top-right',
                autoClose: 5000,
            });
            console.error('Login Error:', error.response || error.message);
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
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
                        {/* <a href="#" className="forgot-password">Forgot Password?</a> */}
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
