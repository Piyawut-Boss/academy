import React, { useEffect, useState } from "react";
import { Typography, Carousel, FloatButton } from "antd";
import { UpOutlined, TeamOutlined, EnvironmentOutlined, PhoneOutlined, CommentOutlined } from '@ant-design/icons';
import logo from './p1.png';
import fbImage from '../images/facebook.png';
import lineImage from '../images/line.png';
import igImage from '../images/instagram.png';
import ytImage from '../images/youtube.png';
import './Aboutus.css';

const { Text } = Typography;

const InfoCard = ({ title, desc }) => (
  <div className="aboutus-info-card">
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

const InfoSection = () => {
  const infoItems = [
    { title: "เป้าหมายของเรา", desc: "เรามุ่งมั่นพัฒนาการเรียนรู้ที่ทำให้ผู้เรียนมีความสุขและได้รับประสบการณ์ที่ดีที่สุด" },
    { title: "สิ่งที่เรานำเสนอ", desc: "เรานำเสนอวิธีการเรียนรู้ที่ทันสมัย สนุกสนาน และมีประสิทธิภาพ" },
    { title: "การวางแผน", desc: "เรามีแผนการพัฒนาหลักสูตรและวิธีการเรียนการสอนให้ทันสมัยอยู่เสมอ" },
    { title: "ความสำเร็จที่ผ่านมา", desc: "เราได้รับรางวัลและผลตอบรับที่ดีจากผู้เรียนและผู้ปกครอง" },
    { title: "วิสัยทัศน์ในอนาคต", desc: "เราตั้งเป้าที่จะขยายการเรียนรู้ให้เข้าถึงผู้เรียนทั่วประเทศ" },
    { title: "พันธกิจของเรา", desc: "เรามุ่งมั่นที่จะสร้างสรรค์สภาพแวดล้อมการเรียนรู้ที่มีคุณภาพ" }
  ];

  return (
    <div className="aboutus-info-section">
      {infoItems.map((item, index) => <InfoCard key={index} title={item.title} desc={item.desc} />)}
    </div>
  );
};

const Aboutus = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:1337/api/tutors?populate=image")
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const tutorImageData = data.data.map((item) => {
            const imageUrl = item.image?.url
              ? "http://localhost:1337" + item.image.url
              : "https://via.placeholder.com/150";
            return { id: item.id, name: item.Name, imageUrl: imageUrl };
          });
          setTutors(tutorImageData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tutors image:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="aboutus-container">
      <div className="aboutus-header">
        <h1>เกี่ยวกับเรา</h1>
      </div>

      <div className="aboutus-subheader">
        <h2>HAPPY LEARNING ACADEMY</h2>
        <p>
          สถาบันของเราให้ความสำคัญกับการเรียนรู้ที่มีความสุขผ่านกระบวนการที่สนุกสนาน
        </p>
      </div>

      <div className="aboutus-logo">
        <img
          src={logo}
          alt="HAPPY LEARNING ACADEMY Logo"
        />
      </div>

      <InfoSection />

      <div id="team-section" className="aboutus-team-tutor">
        <h2>Team Tutor</h2>
        <div className="aboutus-tutor-images">
          {loading ? (
            <Text>กำลังโหลดข้อมูลติวเตอร์...</Text>
          ) : error ? (
            <Text>เกิดข้อผิดพลาดในการโหลดข้อมูลติวเตอร์</Text>
          ) : tutors.length > 0 ? (
            tutors.map((tutor) => (
              <div key={tutor.id} className="aboutus-tutor-image">
                <img
                  src={tutor.imageUrl}
                  alt={`รูปติวเตอร์ ${tutor.name}`}
                  aria-label={`ภาพของติวเตอร์ ${tutor.name}`}
                />
              </div>
            ))
          ) : (
            <Text>ไม่มีข้อมูลของติวเตอร์</Text>
          )}
        </div>
      </div>

      <div id="map-section" className="aboutus-map-section">
        <h3>แผนที่ของเรา</h3>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.618392506893!2d100.492147!3d7.006658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304da3c462d4b6df%3A0x8c34b7c5d1a9eb0b!2sPrince%20of%20Songkla%20University%20Hat%20Yai%20Campus!5e0!3m2!1sen!2sth!4v1707820200000!5m2!1sen!2sth"
          allowFullScreen=""
          loading="lazy"
          title="Prince of Songkla University, Hat Yai Campus"
        ></iframe>
      </div>

      <div id="contact-section" className="aboutus-testimonials">
        <h3>ความคิดเห็นจากนักเรียน</h3>
        <p>
          "สถาบันนี้ช่วยให้ลูกของเราเรียนรู้ได้อย่างสนุกและมีประสิทธิภาพมากขึ้น!"
        </p>
        <p>
          "ติวเตอร์เป็นมืออาชีพและมีทักษะในการสอนที่เยี่ยม"
        </p>
      </div>

      <div className="aboutus-contact-section">
        <h4>ช่องทางการติดต่อ</h4>
        <Carousel className="aboutus-contact-carousel" slidesToShow={4} draggable={false} infinite={true} dots={false}>
          <div className="aboutus-carousel-item">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={fbImage} alt="Facebook" className="aboutus-contact-image" />
            </a>
          </div>
          <div className="aboutus-carousel-item">
            <a href="https://line.me" target="_blank" rel="noopener noreferrer">
              <img src={lineImage} alt="LINE" className="aboutus-contact-image" />
            </a>
          </div>
          <div className="aboutus-carousel-item">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={igImage} alt="Instagram" className="aboutus-contact-image" />
            </a>
          </div>
          <div className="aboutus-carousel-item">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <img src={ytImage} alt="YouTube" className="aboutus-contact-image" />
            </a>
          </div>
        </Carousel>
      </div>

      <FloatButton.Group shape="circle" style={{ right: 24 }}>
        <FloatButton
          icon={<UpOutlined />}
          tooltip="Scroll to Top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
        <FloatButton
          icon={<TeamOutlined />}
          tooltip="Team Tutor"
          onClick={() => {
            const section = document.getElementById("team-section");
            window.scrollTo({ top: section.offsetTop - 170, behavior: "smooth" });
          }}
        />
        <FloatButton
          icon={<EnvironmentOutlined />}
          tooltip="Map"
          onClick={() => {
            const section = document.getElementById("map-section");
            window.scrollTo({ top: section.offsetTop - 120, behavior: "smooth" });
          }}
        />
        <FloatButton
          icon={<PhoneOutlined />}
          tooltip="Contact"
          onClick={() => {
            const section = document.getElementById("contact-section");
            window.scrollTo({ top: section.offsetTop - 50, behavior: "smooth" });
          }}
        />
      </FloatButton.Group>
    </div>
  );
};

export default Aboutus;