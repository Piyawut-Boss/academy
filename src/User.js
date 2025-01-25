import React, { useEffect, useState } from 'react';
import './User.css';  // นำเข้าไฟล์ CSS

function User() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showHeart, setShowHeart] = useState(false);  // สถานะสำหรับการแสดงหัวใจ

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');

    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      setError('Please log in to view your profile');
    }
  }, []);

  const handleClick = () => {
    setShowHeart(true);
    setTimeout(() => {
      setShowHeart(false);  // หัวใจหายไปหลังจาก 1.5 วินาที
    }, 1500);
  };

  if (error) {
    return (
      <div className="error-message">
        <h2>{error}</h2>
      </div>
    );
  }

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h2 className="profile-title">User Profile</h2>
      <p className="welcome-message">Welcome to the User Profile page!</p>

      <div className="profile-circle" onClick={handleClick}>
        <span className="smiley-face">😊</span>
        {showHeart && <span className="heart">❤️</span>}  {/* แสดงหัวใจเมื่อคลิก */}
      </div>

      <div className="user-details">
        <h3 className="username">Username: {user.username}</h3>
        <p className="email">Email: {user.email}</p>
      </div>
    </div>
  );
}

export default User;
