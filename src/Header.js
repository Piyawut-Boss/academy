import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Import ไฟล์ CSS สำหรับ Header

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header-container">
      <h1>My Application</h1>
      <div className="button-container">
        <button className="login-button" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="course-button" onClick={() => navigate('/course')}>
          Course
        </button>
      </div>
    </header>
  );
}

export default Header;
