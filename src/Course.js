import React from 'react';
import Header from './Header'; // นำเข้า Header
import './Course.css'; // หากต้องการเพิ่ม CSS สำหรับหน้า Course

function Course() {
  return (
    <div>
      {/* ใช้ Header */}
      <Header />

      {/* เนื้อหาของหน้า Course */}
      <div className="course-container">
        <h1>Course Page</h1>
        <p>Welcome to the Course!</p>
      </div>
    </div>
  );
}

export default Course;
