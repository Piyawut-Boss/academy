import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HeaderPromoteProvider } from '../Header/HeaderPromote';
import Header from '../Header/Header';
import Footer from '../Footer';
import Home from '../Home/Home'; 
import Login from '../Login/Login';
import Course from '../Course/Course';
import User from '../User/User';
import Howto from '../Howto/Howto';
import Aboutus from '../Aboutus/Aboutus';
import Promotion from '../Promotion';
import Shopping from '../Shopping/Shopping'; 
import Payment from '../Payment/Payment';
import Admin from '../Admin/Admin';
import Study from '../Study/Study';
import './App.css';

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && (
        <>
          <HeaderPromoteProvider /> {/* ✅ เพิ่ม HeaderPromote ที่นี่ */}
          <Header />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <HeaderPromoteProvider>
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
              <Route path="/admin" element={<Admin />} />
              <Route path="/study" element={<Study />} />  {/* ✅ เพิ่มเส้นทาง Study */}
            </Routes>
          </div>
          <Footer />
        </div>
      </HeaderPromoteProvider>
    </Router>
  );
}

export default App;
