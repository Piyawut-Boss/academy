import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Aboutus.css";

const Aboutus = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/tutors?populate=*");
        if (response.data && response.data.data) {
          setTeachers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="aboutus-container">
      <div className="header">
        <h1>เกี่ยวกับเรา</h1>
      </div>

      <div className="introduction">
        <h2>HAPPY LEARNING ACADEMY</h2>
        <p>สถาบันของเราให้ความสำคัญกับการเรียนรู้ที่มีความสุขผ่านกระบวนการที่สนุกสนาน</p>

      </div>

      <div className="teachers">
        <h2>วิสัยทัศน์ของผู้สอน</h2>
        <div className="teacher-list">
          {teachers.length > 0 ? (
            teachers.map((teacher) => {
              const attributes = teacher.attributes || {}; 
              const imageUrl = attributes.Pic?.data?.attributes?.url
                ? `http://localhost:1337${attributes.Pic.data.attributes.url}`
                : "https://via.placeholder.com/150"; // Default image

              return (
                <div key={teacher.id} className="teacher-item">
                  <img src={imageUrl} alt={attributes.Name || "ติวเตอร์"} className="teacher-avatar" />
                  <h3>อ. {attributes.Name || "ไม่ระบุชื่อ"}</h3>
                  <p>{attributes.Discription || "ไม่มีข้อมูล"}</p>
                </div>
              );
            })
          ) : (
            <p>กำลังโหลดข้อมูล...</p>
          )}
        </div>
      </div>

      <div className="contact">
        <h3>ช่องทางการติดต่อ</h3>
        <div className="contact-links">
          <a href="https://facebook.com">Facebook</a>
          <a href="https://line.me">LINE</a>
          <a href="https://instagram.com">Instagram</a>
          <a href="https://youtube.com">YouTube</a>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
