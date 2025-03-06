import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './Header.css';
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
            <div className="nav-left">
                <div className="logo">
                    <img 
                        src={happyLearningLogo} 
                        alt="Logo" 
                        className="logo-image" 
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <nav>
                    <ul className="nav-list main-nav">
                        <li><Link to="/" className={isActiveLink('/')}>หน้าหลัก</Link></li>
                        <li><Link to="/course" className={isActiveLink('/course')}>คอร์สเรียนทั้งหมด</Link></li>
                        <li><Link to="/howto" className={isActiveLink('/howto')}>วิธีการสั่งซื้อ</Link></li>
                        <li><Link to="/promotion" className={isActiveLink('/promotion')}>โปรโมชั่น</Link></li>
                        <li><Link to="/aboutus" className={isActiveLink('/aboutus')}>เกี่ยวกับเรา</Link></li>
                    </ul>
                </nav>
            </div>
            <div className="nav-right">
                <ul className="nav-list user-nav">
                    <li>
                        <Link to="/shopping" className="cart-icon">
                            <ShoppingCartOutlined style={{ fontSize: '26px' }} />
                        </Link>
                    </li>
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
                                    <span style={{ color: "white" }}>{user.username}</span>
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
