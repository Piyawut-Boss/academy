import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HeaderPromoteProvider } from '../Header/HeaderPromote';
import HeaderPromote from '../Header/HeaderPromote';
import Header from '../Header/Header'; // Header ทั่วไป
import HeaderAdmin from '../Header/AdminHeader'; // Header สำหรับ Admin
import Footer from '../Footer';
import Home from '../Home/Home';
import Login from '../Login/Login';
import Course from '../Course/Course';
import User from '../User/User';
import Howto from '../Howto/Howto';
import Aboutus from '../Aboutus/Aboutus';
import Promotion from '../Promotion';
import Shopping from '../Shopping/Shopping';
import Payment from '../Admin/Payment';
import Study from '../Study/Study';
import EditUser from '../Admin/EditUser';  // เพิ่ม EditUser
import './App.css';

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // ตรวจสอบ role ใน localStorage
  const role = localStorage.getItem('role');
  const isLoggedIn = role !== null;

  // เลือกแสดง HeaderAdmin หรือ Header ปกติ ขึ้นอยู่กับ role
  const headerToDisplay = role === 'Admin' ? <HeaderAdmin /> : <Header />;

  return (
    <>
      {/* ตรวจสอบว่าไม่ใช่หน้า Login และตรวจสอบ role */}
      {!isLoginPage && (
        <>
          <HeaderPromote />
          {headerToDisplay} {/* แสดง Header ตาม role */}
        </>
      )}
    </>
  );
}

function ProtectedRoute({ children }) {
  const role = localStorage.getItem('role');

  // ถ้า role ไม่มีหรือไม่ใช่ Admin ให้พาไปหน้าหลักหรือหน้าอื่น
  if (role !== 'Admin') {
    return <Navigate to="/" />;
  }

  return children; // ถ้า role เป็น Admin ให้แสดงเนื้อหาใน route
}

function App() {
  return (
    <Router>
      <HeaderPromoteProvider> {/* ใช้ Provider ครอบทุกส่วนที่ต้องใช้ Context */}
        <div className="app-container">
          <Layout />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/course" element={<Course />} />
              <Route path="/user" element={<User />} />
              <Route path="/howto" element={<Howto />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/promotion" element={<Promotion />} />
              <Route path="/shopping" element={<Shopping />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/study" element={<Study />} />

              {/* หน้าสำหรับ Admin เท่านั้น */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              } />

              {/* เพิ่ม Route สำหรับ EditUser */}
              <Route path="/admin/edituser" element={
                <ProtectedRoute>
                  <EditUser />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </HeaderPromoteProvider>
    </Router>
  );
}

export default App;
