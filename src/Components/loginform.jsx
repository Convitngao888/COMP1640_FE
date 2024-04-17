import React, { useState } from "react";
import './loginform.css';
import { FaUser, FaEyeSlash, FaEye, FaExclamationCircle } from "react-icons/fa";
import { useNavigate, } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useAuth } from './AuthContext';

const LoginForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { login } = useAuth();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const hideMessage = () => {
        setTimeout(() => {
            setErrorMessage('');
            setSuccessMessage('');
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;

        try {
            const response = await fetch('https://localhost:7021/api/Users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: username,
                    password: password
                })
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setErrorMessage('Invalid username or password.');
                } else {
                    setErrorMessage('Login failed. Please try again.');
                }
                hideMessage();
                return;
            }
            setSuccessMessage('Login successful!');
            hideMessage();

            const responseData = await response.json();
            login(responseData.accessToken, responseData.roleId, responseData.userId, responseData.userName, responseData.facultyName);
            
            // Redirect to desired page after successful login
            setTimeout(() => {
                navigate('/homepage');
            }, 2000);

        } catch (error) {
            setErrorMessage('UnKnown Error Occured');
            hideMessage();
        }
    };


    return (
        <div className="login-container">
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" name="username" placeholder='Username' required />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder='Password'
                            required
                        />
                        {showPassword ? (
                            <FaEye className="icon" onClick={togglePasswordVisibility} />
                        ) : (
                            <FaEyeSlash className="icon" onClick={togglePasswordVisibility} />
                        )}
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />Remember me</label>
                        <div >Forgot password?</div>
                    </div>
                    <button type="submit">Login</button>

                    <div className="register-link">
                        <div>Don't have an account? <div onClick={handleRegisterClick}>Register</div></div>
                    </div>
                </form>
            </div>

            <TransitionGroup className="messages">
            {errorMessage && (
                    <CSSTransition
                        classNames="messages"
                        key="error"
                        timeout={{ enter: 300, exit: 300 }}
                    >
                        <div className={`login-error-message`}>
                            <div className="error-text">{errorMessage}</div>
                            <div className="login-icon"><FaExclamationCircle /></div>
                        </div>
                    </CSSTransition>
                )}

                {successMessage && (
                    <CSSTransition
                        classNames="messages"
                        key="success"
                        timeout={{ enter: 300, exit: 300 }}
                    >
                        <div className={`success-message`}>
                            <div className="loading-spinner"></div>
                            {successMessage}
                        </div>
                    </CSSTransition>
                )}
            </TransitionGroup>
        </div>
    );
};

export default LoginForm;
