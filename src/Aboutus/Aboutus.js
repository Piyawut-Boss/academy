import React, { useEffect, useState } from "react";
import { Typography, Carousel } from "antd";
import logo from './p1.png';
import fbImage from '../images/facebook.png';
import lineImage from '../images/line.png';
import igImage from '../images/instagram.png';
import ytImage from '../images/youtube.png';

const { Text } = Typography;

const InfoCard = ({ title, desc }) => (
  <div
    style={{
      background: "#FFC900",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      transition: "box-shadow 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    }}
  >
    <h3 style={{ fontSize: "1.5rem", color: "#473E91" }}>{title}</h3>
    <p
      style={{
        fontSize: "1rem",
        color: "#666",
        marginTop: "10px",
        transition: "color 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#473E91")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
    >
      {desc}
    </p>
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", padding: "20px" }}>
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
    <div style={{ fontFamily: "Arial, sans-serif", color: "#473E91", backgroundColor: "transparent", padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "bold", marginBottom: "30px", color: "#473E91" }}>
        <h1>เกี่ยวกับเรา</h1>
      </div>

      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h2 style={{ color: "#FFC900", fontSize: "2rem", fontWeight: "bold" }}>HAPPY LEARNING ACADEMY</h2>
        <p style={{  maxWidth: "2000px", margin: "0 auto", lineHeight: "1.6", color: "#666" ,fontSize: "1.5rem" }}>
          สถาบันของเราให้ความสำคัญกับการเรียนรู้ที่มีความสุขผ่านกระบวนการที่สนุกสนาน
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "50px" }}>
      <img
  src={logo}
  alt="HAPPY LEARNING ACADEMY Logo"
  style={{width: "1000px", height: "auto",  margin: "0 auto",  display: "block",  marginBottom: "60px",marginTop: "90px"}}
/>

      </div>

      <InfoSection />

      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h2 style={{ marginTop: "100px", marginBottom: "100px", fontSize: "2rem" }}>Team Tutor</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "25px", flexWrap: "wrap" }}>
          {loading ? (
            <Text>กำลังโหลดข้อมูลติวเตอร์...</Text>
          ) : error ? (
            <Text>เกิดข้อผิดพลาดในการโหลดข้อมูลติวเตอร์</Text>
          ) : tutors.length > 0 ? (
            tutors.map((tutor) => (
              <div key={tutor.id} style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src={tutor.imageUrl}
                  alt={`รูปติวเตอร์ ${tutor.name}`}
                  style={{
                    width: "250px",
                    height: "auto",
                    margin: "10px",
                  }}
                  aria-label={`ภาพของติวเตอร์ ${tutor.name}`}
                />
              </div>
            ))
          ) : (
            <Text>ไม่มีข้อมูลของติวเตอร์</Text>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h3 style={{ marginTop: "50px", marginBottom: "90px", fontSize: "2rem" }}>แผนที่ของเรา</h3>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.618392506893!2d100.492147!3d7.006658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304da3c462d4b6df%3A0x8c34b7c5d1a9eb0b!2sPrince%20of%20Songkla%20University%20Hat%20Yai%20Campus!5e0!3m2!1sen!2sth!4v1707820200000!5m2!1sen!2sth"
          width="600"
          height="450"
          style={{ border: "0", maxWidth: "100%", height: "450px", width: "100%" }}
          allowFullScreen=""
          loading="lazy"
          title="Prince of Songkla University, Hat Yai Campus"
        ></iframe>
      </div>

      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h3 style={{ marginTop: "150px", marginBottom: "30px", fontSize: "1.7rem" }}>ความคิดเห็นจากนักเรียน</h3>
        <p style={{ fontSize: "1.3rem", color: "#666" }}>
          "สถาบันนี้ช่วยให้ลูกของเราเรียนรู้ได้อย่างสนุกและมีประสิทธิภาพมากขึ้น!"
        </p>
        <p style={{ fontSize: "1.3rem", color: "#666" }}>
          "ติวเตอร์เป็นมืออาชีพและมีทักษะในการสอนที่เยี่ยม"
        </p>
      </div>

      <div style={{ textAlign: "center" }}>
        <h4 style={{ marginTop: "100px", marginBottom: "30px", fontSize: "1.7rem",marginRight: '10px'}}>ช่องทางการติดต่อ</h4>
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
