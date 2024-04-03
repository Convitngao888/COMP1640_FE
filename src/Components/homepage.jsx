import './homepage.css'
import Header from './header';
import Footer from './footer';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Homepage = () => {
    const navigate = useNavigate();
    const { accessToken, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    }
    const handleAccessStudent = () => {
        navigate('/studentpage');
    }
    const handleAccessAdmin = () => {
        navigate('/adminpage');
    }
    
    return (
        accessToken ? (
            
            <div className='home-container'>
                <Header/>
                <h1>Home Page</h1>
                <button onClick={handleLogout}>Log out</button> 
                <button onClick={handleAccessStudent}>student</button>
                <button onClick={handleAccessAdmin}>admin</button>
                <Footer/>
            </div>
        ) : (
            <Navigate to="/" />
        )
    );
}

export default Homepage;
