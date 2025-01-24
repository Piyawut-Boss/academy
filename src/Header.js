import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import happyLearningLogo from './happy-learning-logo.png';

function Header() {
    const navigate = useNavigate();

    // ฟังก์ชันสำหรับการออกจากระบบ
    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="header-container">
            <div className="logo">
                <img src={happyLearningLogo} alt="Logo" className="logo-image" />
            </div>
            <nav>
                <ul className="nav-list">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/course">Courses</Link></li>
                    <li><Link to="/howto">How to Use</Link></li> 
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/user">User</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
