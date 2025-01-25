import React, { useState, useEffect } from 'react';
import './Course.css';

function Course() {
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);  // เพิ่มการเก็บคอร์สของผู้ใช้
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // สถานะล็อกอินของผู้ใช้
  const [user, setUser] = useState(null); // ข้อมูลของผู้ใช้

  useEffect(() => {
    // ตรวจสอบสถานะการเข้าสู่ระบบ (เช่นจาก localStorage หรือ context)
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(loggedInUser)); // ตั้งค่าผู้ใช้ที่ล็อกอิน
    } else {
      setIsLoggedIn(false);
    }

    // ดึงข้อมูลคอร์สทั้งหมดจาก API
    fetch('http://localhost:1337/api/courses?populate=categories')
      .then((response) => response.json())
      .then((data) => {
        setCourses(data.data); // เซตข้อมูลทั้งหมดที่ได้รับ
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันดึงคอร์สของผู้ใช้ (ถ้าผู้ใช้ล็อกอิน)
  useEffect(() => {
    if (isLoggedIn && user) {
      // สมมุติว่า API ดึงคอร์สของผู้ใช้จาก user id
      fetch(`http://localhost:1337/api/users/${user.id}?populate=courses`)
        .then((response) => response.json())
        .then((data) => {
          // ตรวจสอบว่ามีคอร์สหรือไม่ และเซตข้อมูลให้ถูกต้อง
          if (data.data && data.data.courses) {
            setUserCourses(data.data.courses);  // เซตข้อมูลคอร์สของผู้ใช้
          } else {
            setUserCourses([]); // หากไม่พบคอร์ส
          }
        })
        .catch((error) => {
          console.error('Error fetching user courses:', error);
          setUserCourses([]); // หากเกิดข้อผิดพลาด ให้เซตเป็นอาร์เรย์ว่าง
        });
    }
  }, [isLoggedIn, user]);

  if (loading) {
    return <p>กำลังโหลดข้อมูลคอร์ส...</p>;
  }

  // กรองคอร์สตามหมวดหมู่
  const categories = [...new Set(courses.flatMap(course => course.categories.map(category => category.Category)))];

  return (
    <div className="course-container">
      <h1>คอร์สเรียนทั้งหมด</h1>
      
      {isLoggedIn ? (
        <div>
          <h2>คอร์สของฉัน</h2>
          {userCourses && userCourses.length > 0 ? (  // ตรวจสอบ userCourses ก่อนใช้งาน
            <div className="course-grid">
              {userCourses.map((course) => {
                const { Title, Description, Price, realprice, id } = course;
                const imageUrl = course.Promotepic ? `http://localhost:1337${course.Promotepic.url}` : ''; // ตรวจสอบภาพ

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
          ) : (
            <p>ยังไม่มีคอร์สในรายการของคุณ</p>
          )}
        </div>
      ) : (
        <p>กรุณาล็อกอินเพื่อดูคอร์สของคุณ</p>
      )}

      <h2>คอร์สเรียนทั้งหมด</h2>
      <div className="category-section">
        {categories.map((category) => {
          // กรองคอร์สตามหมวดหมู่
          const filteredCourses = courses.filter(course =>
            course.categories.some(cat => cat.Category === category)
          );

          return (
            <div className="category-section" key={category}>
              <h2>{category}</h2>
              <div className="course-grid">
                {filteredCourses.map((course) => {
                  const { Title, Description, Price, realprice, id } = course;
                  const imageUrl = course.Promotepic ? `http://localhost:1337${course.Promotepic.url}` : ''; // ตรวจสอบภาพ

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
        })}
      </div>
    </div>
  );
}

export default Course;
