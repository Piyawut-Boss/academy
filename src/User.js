// User.js
import React, { useEffect, useState } from 'react';

function User() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // สมมติว่าเราบันทึกข้อมูลผู้ใช้ที่ล็อกอินใน localStorage
    const loggedInUser = localStorage.getItem('user');

    // หากผู้ใช้ล็อกอินแล้ว
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));  // แปลงข้อมูลที่บันทึกใน localStorage
    } else {
      setError('Please log in to view your profile');  // แจ้งให้ล็อกอิน
    }
  }, []);

  if (error) {
    return (
      <div>
        <h2>{error}</h2> {/* แสดงข้อความให้ผู้ใช้ล็อกอิน */}
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>; // รอข้อมูลผู้ใช้
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Welcome to the User Profile page!</p>

      {/* แสดงข้อมูลผู้ใช้ที่ล็อกอิน */}
      <div>
        <h3>Username: {user.username}</h3>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
}

export default User;
