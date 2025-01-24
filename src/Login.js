import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input, Button, notification } from 'antd';  // นำเข้า Ant Design components

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // เคลียร์ข้อความผิดพลาดก่อน

    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: username,
        password: password,
      });

      setIsLoading(false);

      // เก็บ JWT และข้อมูลผู้ใช้ลง localStorage
      const user = {
        username: response.data.user.username,
        email: response.data.user.email,
      };
      localStorage.setItem('jwt', response.data.jwt); // เก็บ JWT
      localStorage.setItem('user', JSON.stringify(user)); // เก็บข้อมูลผู้ใช้

      // แจ้งเตือนเมื่อเข้าสู่ระบบสำเร็จ
      notification.success({
        message: 'Login Successful!',
        description: 'You have successfully logged in.',
      });

      // นำผู้ใช้ไปยังหน้า Course
      navigate('/course');
    } catch (error) {
      setIsLoading(false);
      console.error('Login failed:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Invalid username or password');

      // แจ้งเตือนเมื่อเข้าสู่ระบบล้มเหลว
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.message || 'Please check your username and password.',
      });
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <Input.Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>} {/* แสดงข้อความ error */}
        <Button
          type="primary"
          htmlType="submit"
          className="login-button"
          loading={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <style jsx>{`
        .login-container {
          max-width: 400px;
          margin: 50px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 12px;
          background-color: #fff;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          text-align: center;
          font-family: Arial, sans-serif;
        }

        h2 {
          margin-bottom: 20px;
          color: #473e91;
          font-size: 1.8rem;
        }

        .input-group {
          margin-bottom: 20px;
          text-align: left;
        }

        .input-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #555;
        }

        .error-message {
          color: #f44336;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          background-color: #473e91;
          color: white;
          font-size: 1.2rem;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .login-button:hover {
          background-color: #3b347b;
        }

        .login-button:disabled {
          background-color: #a3a3a3;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .login-container {
            padding: 15px;
          }

          h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
