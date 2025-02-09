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
import Promotion from './Promotion';
import Shopping from './Shopping';  // เพิ่มหน้า Shopping
import Payment from './Payment';  // เพิ่มหน้า Payment
import HeaderPromote from './HeaderPromote';
import './App.css';

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <HeaderPromote />}
      {!isLoginPage && <Header />}
    </>
  );
}
//test
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
              <Route path="/shopping" element={<Shopping />} />  {/* เพิ่มเส้นทาง Shopping */}
              <Route path="/payment" element={<Payment />} />  {/* เพิ่มเส้นทาง Payment */}
            </Routes>
          </div>
          <Footer />
        </div>
      </HeaderPromoteProvider>
    </Router>
  );
}

export default App;
