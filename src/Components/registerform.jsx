import React, { useState, useRef } from "react";
import './registerform.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEye, FaEyeSlash, FaExclamationCircle,  } from "react-icons/fa";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [passwordEntered, setPasswordEntered] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const timeoutRef = useRef(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordsMatch(e.target.value === confirmPassword); // Kiểm tra khớp ngay sau khi thay đổi password
        if (e.target.value === '') {
            setPasswordEntered(false);
        } else {
            setPasswordEntered(true);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordsMatch(e.target.value === password); // Kiểm tra khớp ngay sau khi thay đổi confirmPassword
        if (passwordEntered === true && e.target.value !== '') {
            setPasswordsMatch(e.target.value === password);
        }
    };

    const handleConfirmPasswordBlur = () => {
        if (password === '') {
            setPasswordsMatch(true);
            setPasswordEntered(false);
        } else {
            setPasswordsMatch(confirmPassword === password);
        }
    };

    const hideMessage = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setErrorMessage('');
            setSuccessMessage('');
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }

        try {
            const response = await fetch('https://localhost:7021/api/Users/register', {
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
                if (response.status === 409) {
                    setErrorMessage('Username already exists');
                    setSuccessMessage('');
                } else {
                    // Xử lý các trường hợp lỗi khác nếu cần
                    setErrorMessage('Registration failed. Please try again.');
                    setSuccessMessage('');
                }
                // hideMessage() // Ẩn thông báo sau 2 giây
                return;
            }

            const data = await response.json();
            console.log('Response:', data);
            setSuccessMessage('Registration successful!');
            setErrorMessage('');
            hideMessage();
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            // Xử lý lỗi nếu có
            setErrorMessage('UnKnown Error Occurred');
            setSuccessMessage('');
            hideMessage();
        }
    };

    return (
        <div className="register-container">
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder='Username'
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        {showPassword ? (
                            <FaEye className="icon" onClick={togglePasswordVisibility} />
                        ) : (
                            <FaEyeSlash className="icon" onClick={togglePasswordVisibility} />
                        )}
                        {passwordEntered === false && (
                            <div className="errorMessage">Please input password !</div>
                        )}
                    </div>
                    <div className="input-box">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            onFocus={handleConfirmPasswordBlur}
                            required
                        />
                        {showPassword ? (
                            <FaEye className="icon" onClick={togglePasswordVisibility} />
                        ) : (
                            <FaEyeSlash className="icon" onClick={togglePasswordVisibility} />
                        )}
                        {passwordsMatch === false && confirmPassword !== '' && (
                            <div className="errorMessage">Passwords do not match !</div>
                        )}
                    </div>
                    <button type="submit">Register</button>

                    <div className="login-link">
                        <div>Already have an account? <div onClick={handleLoginClick}>Login</div></div>
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
                        <div className={`error-message`}>
                            <div className="icon"><FaExclamationCircle /></div>
                            {errorMessage}
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

export default RegisterForm;
