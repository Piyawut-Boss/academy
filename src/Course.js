import React, { useState, useEffect } from 'react';
import './Course.css';

function Course() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลจาก API
    fetch('http://localhost:1337/api/courses?populate=*')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched courses:', data);
        setCourses(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>กำลังโหลดข้อมูลคอร์ส...</p>;
  }

  return (
    <div className="course-container">
      <h1>คอร์สเรียนทั้งหมด</h1>
      <div className="course-grid">
        {courses.map((course) => {
          const { Title, Description, Price, realprice, id, image } = course;
          const imageUrl = image ? `http://localhost:1337${image}` : ''; // ตรวจสอบภาพ

          return (
            <div className="course-card" key={id}>
              {/* ตรวจสอบว่า imageUrl มีหรือไม่ ถ้าไม่มีจะแสดงกรอบเปล่า */}
              <div className={`course-image ${!imageUrl ? 'no-image' : ''}`} style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : '' }}>
                {!imageUrl && <span className="no-image-text">ไม่มีภาพ</span>}
              </div>
              <h3>{Title || 'ชื่อคอร์สไม่ระบุ'}</h3>
              <p>{Description || 'รายละเอียดคอร์สไม่ระบุ'}</p>
              <div className="price">
                <span className="price-original">
                  {Price ? Price.toLocaleString() : 'ราคาปกติไม่ระบุ'} บาท
                </span>
                <span className="price-discounted">
                  {realprice ? realprice.toLocaleString() : 'ราคาหลังลดไม่ระบุ'} บาท
                </span>
              </div>
              <div className="buttons">
                <button className="details-button">อ่านรายละเอียด</button>
                <button className="enroll-button">สมัครเรียน</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Course;
