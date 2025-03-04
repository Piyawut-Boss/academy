import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import './AdminHeader.css';
import happyLearningLogo from './happy-learning-logo.png';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = !!localStorage.getItem('jwt');

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" onClick={() => navigate('/user')}>
                <UserOutlined /> Profile
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" onClick={handleLogout} danger>
                <LogoutOutlined /> Logout
            </Menu.Item>
        </Menu>
    );

    const isActiveLink = (path) => {
        return location.pathname === path ? 'active-link' : '';
    };

    return (
        <header className="header-container">
            <div className="nav-section-left">
                <div className="logo">
                    <img 
                        src={happyLearningLogo} 
                        alt="Logo" 
                        className="logo-image" 
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <nav className="main-nav">
                    <ul className="nav-list">
                        <li><Link to="/" className={isActiveLink('/')}>หน้าหลัก</Link></li>
                        <li><Link to="/course" className={isActiveLink('/course')}>คอร์สเรียน</Link></li>
                        <li><Link to="/promotion" className={isActiveLink('/promotion')}>โปรโมชั่น</Link></li>
                        <li><Link to="/admin/EditPayment" className={`nav-button ${isActiveLink('/admin/EditPayment')}`}>การจัดการการชำระเงิน</Link></li>
                        <li><Link to="/admin/EditUser" className={isActiveLink('/admin/EditUser')}>การจัดการผู้ใช้</Link></li>
                        <li><Link to="/admin/EditCourse" className={isActiveLink('/admin/EditCourse')}>การจัดการคอร์ส</Link></li>
                        <li><Link to="/admin/EditPromotion" className={isActiveLink('/admin/EditPromotion')}>การจัดการโปรโมชั่น</Link></li>
                        <li><Link to="/admin/EditUnit" className={isActiveLink('/admin/EditUnit')}>การจัดการยูนิต</Link></li>
                        <li><Link to="/admin/DashBoard" className={isActiveLink('/admin/DashBoard')}>แดชบอร์ด</Link></li>
                    </ul>
                </nav>
            </div>
            <div className="nav-section-right">
                <ul className="nav-list">
                    {!isLoggedIn && (
                        <li>
                            <Link to="/login" className="login-button">
                                เข้าสู่ระบบ
                            </Link>
                        </li>
                    )}

                    {isLoggedIn && user && (
                        <li>
                            <Dropdown overlay={userMenu} trigger={['click']}>
                                <div className="user-menu">
                                    <Avatar size="small" icon={<UserOutlined />} />
                                    <span>{user.username}</span>
                                </div>
                            </Dropdown>
                        </li>
                    )}
                </ul>
            </div>
        </header>
    );
}

export default Header;
