import React, { useEffect, useState } from "react";
import { Typography } from "antd";

const { Text } = Typography;

const Aboutus = () => {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1337/api/tutors?populate=image")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data); // Debug ดูโครงสร้างข้อมูลที่ได้จาก API
  
        if (data.data) {
          const tutorImageData = data.data
            .filter((item) => item.attributes) // ตรวจสอบว่ามี attributes จริง
            .map((item) => {
              const imageUrl = item.attributes.image?.data?.attributes?.url
                ? "http://localhost:1337" + item.attributes.image.data.attributes.url
                : "https://via.placeholder.com/150"; // ใช้ภาพ placeholder ถ้าไม่มีรูป
              return { 
                id: item.id, 
                name: item.attributes.Name || "ไม่ระบุชื่อ", 
                imageUrl 
              };
            });
  
          setTutors(tutorImageData);
        }
      })
      .catch((error) => console.error("Error fetching tutors image:", error));
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#473E91", backgroundColor: "#fff", padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "bold", marginBottom: "30px", color: "#473E91" }}>
        <h1>เกี่ยวกับเรา</h1>
      </div>

      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h2 style={{ color: "#FFC900", fontSize: "2rem", fontWeight: "bold" }}>HAPPY LEARNING ACADEMY</h2>
        <p style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6", color: "#666" }}>
          สถาบันของเราให้ความสำคัญกับการเรียนรู้ที่มีความสุขผ่านกระบวนการที่สนุกสนาน
        </p>
      </div>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px",
  }}
>
  {[
    {
      title: "เป้าหมายของเรา",
      desc: "เรามุ่งมั่นพัฒนาการเรียนรู้ที่ทำให้ผู้เรียนมีความสุขและได้รับประสบการณ์ที่ดีที่สุด",
    },
    {
      title: "สิ่งที่เรานำเสนอ",
      desc: "เรานำเสนอวิธีการเรียนรู้ที่ทันสมัย สนุกสนาน และมีประสิทธิภาพ",
    },
    {
      title: "การวางแผน",
      desc: "เรามีแผนการพัฒนาหลักสูตรและวิธีการเรียนการสอนให้ทันสมัยอยู่เสมอ",
    },
    {
      title: "ความสำเร็จที่ผ่านมา",
      desc: "เราได้รับรางวัลและผลตอบรับที่ดีจากผู้เรียนและผู้ปกครอง",
    },
    {
      title: "วิสัยทัศน์ในอนาคต",
      desc: "เราตั้งเป้าที่จะขยายการเรียนรู้ให้เข้าถึงผู้เรียนทั่วประเทศ",
    },
    {
      title: "พันธกิจของเรา",
      desc: "เรามุ่งมั่นที่จะสร้างสรรค์สภาพแวดล้อมการเรียนรู้ที่มีคุณภาพ",
    },
  ].map((item, index) => (
    <div
      key={index}
      style={{
        background: "#FFC900",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      }}
    >
      <h3 style={{ fontSize: "1.5rem", color: "#473E91" }}>{item.title}</h3>
      <p style={{ fontSize: "1rem", color: "#666", marginTop: "10px" }}>
        {item.desc}
      </p>
    </div>
  ))}
</div>


      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h2>Team Tutor</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "25px", flexWrap: "wrap" }}>
          {tutors.length > 0 ? (
            tutors.map((tutor) => (
              <div key={tutor.id} style={{ padding: "20px", borderRadius: "15px", maxWidth: "200px", textAlign: "center", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)" }}>
                <img
                  src={tutor.imageUrl}
                  alt={`รูปติวเตอร์ ${tutor.name}`}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))
          ) : (
            <div><Text>ไม่มีข้อมูลของติวเตอร์</Text></div>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h3>แผนที่ของเรา</h3>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.618392506893!2d100.492147!3d7.006658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304da3c462d4b6df%3A0x8c34b7c5d1a9eb0b!2sPrince%20of%20Songkla%20University%20Hat%20Yai%20Campus!5e0!3m2!1sen!2sth!4v1707820200000!5m2!1sen!2sth"
          width="600"
          height="450"
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
          title="Prince of Songkla University, Hat Yai Campus"
        ></iframe>
      </div>

      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h3>ความคิดเห็นจากนักเรียน</h3>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          "สถาบันนี้ช่วยให้ลูกของเราเรียนรู้ได้อย่างสนุกและมีประสิทธิภาพมากขึ้น!"
        </p>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          "ติวเตอร์เป็นมืออาชีพและมีทักษะในการสอนที่เยี่ยม"
        </p>
      </div>

      <div style={{ textAlign: "center" }}>
  <h3>ช่องทางการติดต่อ</h3>
  {["Facebook", "LINE", "Instagram", "YouTube"].map((platform) => (
    <a
      key={platform}
      href={`https://${platform.toLowerCase()}.com`}
      style={{
        margin: "0 20px",
        color: "#473E91",
        fontSize: "1.4rem",
        textDecoration: "none",
        fontWeight: "bold",
        transition: "color 0.3s ease",
      }}
      onMouseEnter={(e) => (e.target.style.color = "#FFC900")} 
      onMouseLeave={(e) => (e.target.style.color = "#473E91")} 
    >
      {platform}
    </a>
  ))}
</div>

    </div>
  );
};

export default Aboutus;
