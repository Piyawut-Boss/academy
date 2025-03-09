import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Login from './Login';
import axios from 'axios';
import { notification } from 'antd';

// Mock axios และ notification
jest.mock('axios');
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Login Component - Register', () => {
  it('should handle registration successfully', async () => {
    // Mock axios.post เพื่อจำลองการตอบกลับที่สำเร็จ
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<Login />);

    // คลิกที่ปุ่ม "สมัคร" เพื่อเปลี่ยนไปหน้า Register
    fireEvent.click(screen.getByText(/สมัคร/i));

    // กรอกข้อมูลในฟอร์ม
    fireEvent.change(screen.getByPlaceholderText('ชื่อผู้ใช้'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('อีเมล'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('รหัสผ่าน'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('ยืนยันรหัสผ่าน'), {
      target: { value: 'password123' },
    });

    // คลิกที่ปุ่ม "สร้างบัญชี" โดยใช้ role
    fireEvent.click(screen.getByRole('button', { name: /สร้างบัญชี/i }));

    // รอให้การเรียก API เสร็จสิ้น
    await waitFor(() => {
      // ตรวจสอบว่า axios.post ถูกเรียกด้วยข้อมูลที่ถูกต้อง
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/local/register'),
        {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        }
      );

      // ตรวจสอบว่า notification.success ถูกเรียก
      expect(notification.success).toHaveBeenCalledWith({
        message: 'Registration Successful!',
      });

      // ตรวจสอบว่า isRegister ถูกตั้งค่าเป็น false หลังจากลงทะเบียนสำเร็จ
      expect(screen.getByText(/เข้าสู่ระบบ/i)).toBeInTheDocument();
    });
  });

  it('should handle registration failure', async () => {
    // Mock axios.post เพื่อจำลองการตอบกลับที่ล้มเหลว
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Registration failed' } },
    });

    render(<Login />);

    // คลิกที่ปุ่ม "สมัคร" เพื่อเปลี่ยนไปหน้า Register
    fireEvent.click(screen.getByText(/สมัคร/i));

    // กรอกข้อมูลในฟอร์ม
    fireEvent.change(screen.getByPlaceholderText('ชื่อผู้ใช้'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('อีเมล'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('รหัสผ่าน'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('ยืนยันรหัสผ่าน'), {
      target: { value: 'password123' },
    });

    // คลิกที่ปุ่ม "สร้างบัญชี" โดยใช้ role
    fireEvent.click(screen.getByRole('button', { name: /สร้างบัญชี/i }));

    // รอให้การเรียก API เสร็จสิ้น
    await waitFor(() => {
      // ตรวจสอบว่า axios.post ถูกเรียกด้วยข้อมูลที่ถูกต้อง
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/local/register'),
        {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        }
      );

      // ตรวจสอบว่า notification.error ถูกเรียก
      expect(notification.error).toHaveBeenCalledWith({
        message: 'Registration Failed',
      });

      // ตรวจสอบว่าข้อความผิดพลาดแสดงขึ้น
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

  it('should show error if passwords do not match', async () => {
    render(<Login />);

    // คลิกที่ปุ่ม "สมัคร" เพื่อเปลี่ยนไปหน้า Register
    fireEvent.click(screen.getByText(/สมัคร/i));

    // กรอกข้อมูลในฟอร์ม
    fireEvent.change(screen.getByPlaceholderText('ชื่อผู้ใช้'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('อีเมล'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('รหัสผ่าน'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('ยืนยันรหัสผ่าน'), {
      target: { value: 'differentpassword' },
    });

    // คลิกที่ปุ่ม "สร้างบัญชี" โดยใช้ role
    fireEvent.click(screen.getByRole('button', { name: /สร้างบัญชี/i }));

    // ตรวจสอบว่าข้อความผิดพลาดแสดงขึ้น
    expect(screen.getByText(/Passwords do not match!/i)).toBeInTheDocument();
  });
});