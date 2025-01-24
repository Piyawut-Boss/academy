import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HeaderPromoteProvider } from './HeaderPromote'; 
import Header from './Header'; 
import Footer from './Footer'; 
import Home from './Home';
import Login from './Login';
import Course from './Course';
import User from './User';  
import Howto from './Howto';  
import Aboutus from './Aboutus'; 
import Promotion from './Promotion'; // เพิ่มการนำเข้า Promotion
import HeaderPromote from './HeaderPromote'; 

function Layout() {
  const location = useLocation(); // ใช้ useLocation เพื่อดึงข้อมูล URL ปัจจุบัน
  
  // เช็คว่าหน้า URL คือ /login หรือไม่
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <HeaderPromote />} {/* ถ้าไม่ใช่หน้า Login จะให้แสดง HeaderPromote */}
      {!isLoginPage && <Header />} {/* ถ้าไม่ใช่หน้า Login จะให้แสดง Header */}
      {!isLoginPage && <Footer />} {/* ถ้าไม่ใช่หน้า Login จะให้แสดง Footer */}
    </>
  );
}

function App() {
  return (
    <Router>
      <HeaderPromoteProvider>
        <Layout /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/course" element={<Course />} />
          <Route path="/user" element={<User />} />
          <Route path="/howto" element={<Howto />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/promotion" element={<Promotion />} /> {/* เพิ่มเส้นทางสำหรับ Promotion */}
        </Routes>
      </HeaderPromoteProvider>
    </Router>
  );
}

export default App;
