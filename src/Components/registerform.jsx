import React, { useState, useEffect } from "react";
import './registerform.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEye, FaEyeSlash, FaExclamationCircle,  } from "react-icons/fa";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { DownOutlined, MailOutlined } from '@ant-design/icons';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [facultyOptions, setFacultyOptions] = useState([]);
    const [faculty, setFaculty] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [passwordEntered, setPasswordEntered] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await fetch('https://localhost:7021/api/Faculties');
                if (!response.ok) {
                    throw new Error('Failed to fetch faculties');
                }
                const data = await response.json();
                // Filter out the faculty with name "None"
                const filteredFaculties = data.filter(faculty => faculty.facultyName !== "None");
                setFacultyOptions(filteredFaculties);
            } catch (error) {
                console.error('Error fetching faculties:', error);
            }
        };

        fetchFaculties();
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginClick = () => {
        navigate('/');
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordsMatch(e.target.value === confirmPassword);
        if (e.target.value === '') {
            setPasswordEntered(false);
        } else {
            setPasswordEntered(true);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordsMatch(e.target.value === password);
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

    const handleFacultyChange = (e) => {
        setFaculty(e.target.value);
    };

    const hideMessage = () => {
        setTimeout(() => {
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
                    password: password,
                    facultyName: faculty,
                    email: email,
                })
            });
            if (!response.ok) {
                if (response.status === 409) {
                    setErrorMessage('Username already exists');
                    setSuccessMessage('');
                } else if(response.status === 400) {
                    setErrorMessage('Please input valid Email');
                    setSuccessMessage('');
                }
                hideMessage();
                return;
            }

            const data = await response.json();
            console.log('Response:', data);
            setSuccessMessage('Registration successful!');
            setErrorMessage('');
            hideMessage();
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            setErrorMessage('Unknown Error Occurred');
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
                            placeholder='Email'
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                        <MailOutlined  className="icon" />
                    </div>
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
                            onBlur={handleConfirmPasswordBlur}
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
                    <div className="input-box">
                        <select className="select"
                            value={faculty}
                            onChange={handleFacultyChange}
                            required
                        >
                            <option className="option" value="">Select Faculty  </option>
                            {facultyOptions.map(option => (
                                <option className="option" key={option.facultyId} value={option.facultyName}>{option.facultyName}</option>
                            ))}
                        </select>
                        <DownOutlined className="icon"/>
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
