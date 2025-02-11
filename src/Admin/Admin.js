import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();

  // ตรวจสอบสิทธิ์การเข้าถึง Admin
  const role = localStorage.getItem('role');
  useEffect(() => {
    if (role !== 'Admin') {
      navigate('/'); // ถ้าไม่ใช่ admin ให้กลับไปหน้าหลัก
    }
  }, [role, navigate]);

  // ฟังก์ชันสำหรับ Logout
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <h1>Hello, Admin!</h1>
      <p>Welcome to the Admin Dashboard.</p>

      {/* ที่นี่จะเป็นที่สำหรับจัดการข้อมูลผู้ใช้หรือการดำเนินการอื่น ๆ */}
      <h2>User Management</h2>
      {/* คุณสามารถเพิ่มฟังก์ชันจัดการผู้ใช้หรือการแสดงข้อมูลจาก API ในที่นี้ได้ */}

      {/* ปุ่ม Logout */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Admin;
