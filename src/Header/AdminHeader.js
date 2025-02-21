import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHeader.css';
import happyLearningLogo from './happy-learning-logo.png';

function Header() {
    const navigate = useNavigate();

    // ✅ ดึงข้อมูล User และ Role อย่างถูกต้อง
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = !!localStorage.getItem('jwt'); // แปลงเป็น Boolean

    // ✅ ฟังก์ชัน Logout
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
                    <li><Link to="/">หน้าหลัก</Link></li>
                    <li><Link to="/course">คอร์สเรียนทั้งหมด</Link></li>
                    <li><Link to="/promotion">โปรโมชั่น</Link></li>
                    <li><Link to="/admin/EditPayment">Payment</Link></li>
                    <li><Link to="/admin/EditUser">User</Link></li>
                    <li><Link to="/admin/EditCourse">Course</Link></li>
                    <li><Link to="/admin/EditPromotion">Promotion</Link></li>

                    {/* ✅ แสดงปุ่ม Login ถ้ายังไม่ได้ล็อกอิน */}
                    {!isLoggedIn && <li><Link to="/login">Login</Link></li>}

                    {/* ✅ แสดงชื่อ User หากล็อกอินแล้ว */}
                    {isLoggedIn && user && (
                        <li><Link to="/user">{user.username}</Link></li>
                    )}

                    {/* ✅ แสดงปุ่ม Logout หากล็อกอินแล้ว */}
                    {isLoggedIn && <li><button style={{marginRight: '20px' }} onClick={handleLogout}>Logout </button></li>}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
