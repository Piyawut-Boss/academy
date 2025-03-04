import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input, Button, notification, Card } from 'antd';
import { motion } from 'framer-motion';
import './Login.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

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
      const response = await axios.post(`${API_BASE}/auth/local`, {
        identifier: username,
        password: password,
      });

      const { jwt, user } = response.data;

      const meResponse = await axios.get(`${API_BASE}/users/me?populate=*`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const role = meResponse.data.role?.name || 'User';

      localStorage.setItem('jwt', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', role);

      notification.success({ message: 'Login Successful!' });

      if (role === 'Admin') {
        navigate('/admin/EditPayment');
      } else {
        navigate('/course');
      }
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
      await axios.post(`${API_BASE}/auth/local/register`, {
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
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Button
        onClick={() => navigate(-1)}
        className="back-button"
      >
        Back
      </Button>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="login-container">
          <h2 className="text-3xl font-bold mb-8">
            {isRegister ? 'Create Account!' : 'Welcome Back!'}
          </h2>
          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-6">
            <div className="input-group">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="large"
                className="modern-input"
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
                  className="modern-input"
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
                className="modern-input"
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
                  className="modern-input"
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
              {isLoading ? 'Loading...' : isRegister ? 'Sign Up' : 'Login'}
            </Button>
          </form>
          <p className="mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              onClick={() => setIsRegister(!isRegister)}
              className="toggle-text font-semibold cursor-pointer"
            >
              {isRegister ? 'Login' : 'Register'}
            </span>
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Login;
