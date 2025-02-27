import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from '../Header/Header';
import HeaderAdmin from '../Header/AdminHeader';
import Footer from '../Footer';
import Home from '../Home/Home';
import Login from '../Login/Login';
import Course from '../Course/Course';
import User from '../User/User';
import Howto from '../Howto/Howto';
import Aboutus from '../Aboutus/Aboutus';
import Promotion from '../Promotion/Promotion.js';
import Shopping from '../Shopping/Shopping';
import Study from '../Study/Study';
import Payment from '../Payment/Payment';  

// Import Admin Pages
import EditPayment from '../Admin/EditPayment';
import EditUser from '../Admin/EditUser';
import EditCourse from '../Admin/EditCourse';
import EditPromotion from '../Admin/EditPromotion';
import EditCourseDetail from '../Admin/EditCourseDetail';
import EditUnit from '../Admin/EditUnit.js';

import './App.css';

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const role = localStorage.getItem('role');

  return (
    <>
      {!isLoginPage && (
        <>
          {role === 'Admin' ? <HeaderAdmin /> : <Header />}
        </>
      )}
    </>
  );
}

function ProtectedRoute({ children }) {
  const role = localStorage.getItem('role');
  return role === 'Admin' ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
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
            <Route path="/study/:documentId" element={<Study />} />
            <Route path="/payment" element={<Payment />} />

            {/* Protected Routes for Admin */}
            <Route path="/admin/editpayment" element={<ProtectedRoute><EditPayment /></ProtectedRoute>} />
            <Route path="/admin/edituser" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
            <Route path="/admin/editcourse" element={<ProtectedRoute><EditCourse /></ProtectedRoute>} />
            <Route path="/admin/editpromotion" element={<ProtectedRoute><EditPromotion /></ProtectedRoute>} />
            <Route path="/admin/editcourse/:documentId" element={<ProtectedRoute><EditCourseDetail /></ProtectedRoute>} />
            <Route path="/admin/editunit" element={<ProtectedRoute><EditUnit /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
