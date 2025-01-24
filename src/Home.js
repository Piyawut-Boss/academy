import React from 'react';
import Header from './Header'; // นำเข้า Header ที่แยกออกมา
import './Home.css'; // Import ไฟล์ CSS สำหรับ Home (กรณีมี)

function Home() {
  return (
    <div className="home-container">
      {/* ใช้ Header */}
      <Header />

      {/* เนื้อหาของหน้า Home */}
      <div>
        <h2>Welcome to My Application!</h2>
        <p>Explore the courses and login to start your journey.</p>
      </div>
    </div>
  );
}

export default Home;
