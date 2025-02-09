import React from "react";
import "./Aboutus.css";

const Aboutus = () => {
  return (
    <div className="aboutus-container">
      <div className="header">
        <h1>เกี่ยวกับเรา</h1>
      </div>

      <div className="introduction">
        <h2>HAPPY LEARNING ACADEMY</h2>
        <p>สถาบันของเราให้ความสำคัญกับการเรียนรู้ที่มีความสุขผ่านกระบวนการที่สนุกสนาน</p>
        <img src="/images/aboutus-banner.png" alt="about us" className="banner" />
      </div>

      <div className="features">
        {[
          { title: "วิชาที่เปิดสอน", text: "คณิตศาสตร์, วิทยาศาสตร์, ภาษาอังกฤษ" },
          { title: "สิ่งที่เรามุ่งเน้น", text: "การเรียนรู้ที่สนุกสนานและมีประสิทธิภาพ" },
          { title: "การบริการ", text: "ดูแลนักเรียนเป็นอย่างดี" },
        ].map((item, index) => (
          <div key={index} className="feature-item">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <div className="teachers">
        <h2>วิสัยทัศน์ของผู้สอน</h2>
        <div className="teacher-list">
          {['พี่บิล', 'พี่โบ้ท', 'พี่บอส', 'พี่วิว', 'พี่ตอง'].map((teacher, index) => (
            <div key={index} className="teacher-item">
              <div className="teacher-avatar"></div>
              <h3>อ. {teacher}</h3>
              <p>มีประสบการณ์และความสามารถในการสอน</p>
            </div>
          ))}
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
