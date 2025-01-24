import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HeaderPromoteProvider } from './HeaderPromote'; // นำเข้า HeaderPromoteProvider
import Header from './Header'; // นำเข้า Header.js
import Footer from './Footer'; // นำเข้า Footer.js
import Home from './Home';
import Login from './Login';
import Course from './Course';
import User from './User';  
import Howto from './Howto';  // นำเข้า Howto.js
import HeaderPromote from './HeaderPromote'; // นำเข้า HeaderPromote

function App() {
  return (
    <Router>
      <HeaderPromoteProvider>  {/* ห่อหุ้มทั้งหมดด้วย HeaderPromoteProvider */}
        <HeaderPromote />  {/* แสดง HeaderPromote */}
        <Header />  {/* แสดง Header ในทุกหน้า */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/course" element={<Course />} />
          <Route path="/user" element={<User />} />
          <Route path="/howto" element={<Howto />} />  {/* เพิ่มเส้นทางสำหรับ Howto */}
        </Routes>
        <Footer />  {/* แสดง Footer ในทุกหน้า */}
      </HeaderPromoteProvider>
    </Router>
  );
}

export default App;
