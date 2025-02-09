import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input, Button, notification, Card } from 'antd';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: username,
        password: password,
      });
      setIsLoading(false);
      localStorage.setItem('jwt', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      notification.success({ message: 'Login Successful!' });
      navigate('/course');
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data?.message || 'Invalid username or password');
      notification.error({ message: 'Login Failed' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (password !== confirmPassword) {
      setIsLoading(false);
      setError('Passwords do not match!');
      return;
    }
    try {
      await axios.post('http://localhost:1337/api/auth/local/register', {
        username,
        email,
        password,
      });
      setIsLoading(false);
      notification.success({ message: 'Registration Successful!' });
      setIsRegister(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data?.message || 'Registration failed');
      notification.error({ message: 'Registration Failed' });
    }
  };

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-gray-100 p-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* ปุ่มย้อนกลับด้านนอก Card */}
      <Button
        className="back-button absolute top-4 left-4"
        onClick={() => navigate(-1)} // ทำการย้อนกลับไปหน้าก่อน
        style={{ marginBottom: '20px' }}
      >
        Back
      </Button>

      <Card className="login-container">
        <h2>{isRegister ? 'Create an Account' : 'Sign in to Your Account'}</h2>
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          <div className="input-group">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="large"
              className="rounded-lg"
              required
            />
          </div>
          {isRegister && (
            <div className="input-group">
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="large"
                className="rounded-lg"
                required
              />
            </div>
          )}
          <div className="input-group">
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="large"
              className="rounded-lg"
              required
            />
          </div>
          {isRegister && (
            <div className="input-group">
              <Input.Password
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="large"
                className="rounded-lg"
                required
              />
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
          <Button
            type="primary"
            htmlType="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : isRegister ? 'Sign Up' : 'Login'}
          </Button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => setIsRegister(!isRegister)}
            className="toggle-button text-indigo-600 font-semibold cursor-pointer hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </Card>
    </motion.div>
  );
};

export default Login;
