import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import happyLearningLogo from './happy-learning-logo.png';
import { ShoppingCartOutlined } from '@ant-design/icons';  // นำเข้าไอคอนจาก Ant Design

function Header() {
    const navigate = useNavigate();

    // ฟังก์ชันสำหรับการออกจากระบบ
    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // เช็คว่าผู้ใช้ล็อกอินแล้วหรือยัง
    const isLoggedIn = localStorage.getItem('jwt') || localStorage.getItem('user');

    return (
        <header className="header-container">
            <div className="logo">
                <img src={happyLearningLogo} alt="Logo" className="logo-image" />
            </div>
            <nav>
                <ul className="nav-list">
                    <li><Link to="/">หน้าหลัก</Link></li>
                    <li><Link to="/course">คอร์สเรียนทั้งหมด</Link></li>
                    <li><Link to="/howto">วิธีการสั่งซื้อ</Link></li>
                    <li><Link to="/promotion">โปรโมชั่น</Link></li>
                    <li><Link to="/aboutus">เกี่ยวกับเรา</Link></li>

                    {/* ใช้แค่ไอคอนตะกร้า */}
                    <li><Link to="/shopping"><ShoppingCartOutlined style={{ fontSize: '24px' }} /></Link></li>

                    {/* แสดงปุ่ม Login หากยังไม่ได้ล็อกอิน */}
                    {!isLoggedIn && <li><Link to="/login">Login</Link></li>}

                    {/* แสดงปุ่ม User หากล็อกอินแล้ว */}
                    {isLoggedIn && <li><Link to="/user">User</Link></li>}

                    {/* แสดงปุ่ม Logout หากล็อกอินแล้ว */}
                    {isLoggedIn && <li><button onClick={handleLogout}>Logout</button></li>}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
