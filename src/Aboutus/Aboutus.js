import React, { useEffect, useState } from "react";
import axios from "axios";
import {Carousel, Typography,} from "antd";
import fbImage from '../images/facebook.png';
import lineImage from '../images/line.png';
import igImage from '../images/instagram.png';
import ytImage from '../images/youtube.png';
import "./Aboutus.css";

const { Title, } = Typography;

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

      <div className="contact-section">
          <Title level={2} className="contact-title">ช่องทางการติดตาม</Title>
          <Carousel className="contact-carousel" slidesToShow={4} draggable={false} infinite={true} dots={false}>
            <div className="carousel-item">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={fbImage} alt="Facebook" className="contact-image" />
              </a>
            </div>
            <div className="carousel-item">
              <a href="https://line.me" target="_blank" rel="noopener noreferrer">
                <img src={lineImage} alt="LINE" className="contact-image" />
              </a>
            </div>
            <div className="carousel-item">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={igImage} alt="Instagram" className="contact-image" />
              </a>
            </div>
            <div className="carousel-item">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <img src={ytImage} alt="YouTube" className="contact-image" />
              </a>
            </div>
          </Carousel>
        </div>

    </div>
  );
};

export default Aboutus;
