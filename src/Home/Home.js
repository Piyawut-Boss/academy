import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Carousel, Badge, Typography } from "antd";
import { TrophyOutlined, FileTextOutlined, GiftOutlined, VideoCameraOutlined } from "@ant-design/icons";
import './Home.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1337/api/banners?populate=*")
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const bannerImages = data.data.map((item) => {
            const banner = item.Banner;
            const baseUrl = "http://localhost:1337";
            let imageUrl = banner.url ? "http://localhost:1337" + banner.url : "https://via.placeholder.com/1200x250";


            return {
              id: item.id,
              imageUrl: imageUrl,
            };
          });
          setBanners(bannerImages);
        }
      })
      .catch((error) => console.error("Error fetching banners:", error));

    fetch("http://localhost:1337/api/tutors?populate=image")
      .then((response) => response.json())
      .then((data) => {
        console.log("Tutor data:", data);
        if (data.data) {
          const tutorImageData = data.data.map((item) => {
            const imageUrl = item.image?.url
              ? "http://localhost:1337" + item.image.url
              : "https://via.placeholder.com/150";
            return {
              id: item.id,
              name: item.Name,  // ตรวจสอบให้แน่ใจว่ามีการดึงชื่อจาก API 
              imageUrl: imageUrl,
            };
          });

          console.log("Tutor Image Data:", tutorImageData);
          setTutors(tutorImageData);
        }
      })
      .catch((error) => console.error("Error fetching tutors image:", error));

    // Fetch categories data
    fetch("http://localhost:1337/api/tutors?populate=categories")
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const tutorCategoryData = data.data.map((item) => {
            const categories = item.categories.map((category) => category.Category).join(", ");
            return { id: item.id, categories: categories };
          });

          setTutors((prevTutors) =>
            prevTutors.map((tutor) => ({
              ...tutor,
              categories: tutorCategoryData.find((item) => item.id === tutor.id)?.categories || tutor.categories,
            }))
          );
        }
      })
      .catch((error) => console.error("Error fetching tutors categories:", error));

  }, []);

  return (
    <Layout className="home-layout">
      <Content>
        <Carousel autoplay className="banner-carousel background-image">
          {banners.length > 0 ? (
            banners.map((banner) => (
              <div key={banner.id}>
                <img src={banner.imageUrl} alt={`Banner ${banner.id}`} style={{ width: "100%" }} />
              </div>
            ))
          ) : (
            <div><img src="https://via.placeholder.com/1200x250" alt="Placeholder Banner" /></div>
          )}
        </Carousel>

        <div className="section">
          <Title level={1}>
            <span className="team-container">
              <span className="team-text">Team</span>
              <span className="tutor-text">Tutor</span>
              <span className="academy-text">HAPPYLearningAcademy</span>
            </span>
          </Title>
          <p className="team-description">สอนสนุก อธิบายละเอียดยิบ เทคนิคจัดเต็ม !!</p>

          <Row gutter={[16, 16]} justify="center">
            {tutors.length > 0 ? (
              tutors.map((tutor) => (
                <Col key={tutor.id} xs={24} sm={8}>
                  <Card hoverable className="custom-card"
                   style={{ backgroundColor: "#000000 !important", boxShadow: "none", border: "none" }}>
                    <img
                  
                      src={tutor.imageUrl}
                      className="card-image"
                      alt={`รูปติวเตอร์ ${tutor.name}`}
                    />
                    <div className="card-content">
                      
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Text>ไม่มีข้อมูลของติวเตอร์</Text>
            )}
          </Row>


        </div>

        <div className="section">
          <Title level={2}><TrophyOutlined /> นักเรียนที่ได้คะแนนสูงสุด</Title>
          <Row gutter={[16, 16]} justify="center">
            {["น้อง A", "น้อง B", "น้อง C"].map((name, index) => (
              <Col key={index} xs={24} sm={8}>
                <Badge.Ribbon text="TPAT 3 98/100" color="gold">
                  <Card hoverable className="leaderboard-card" title={name}>
                    <Text>โรงเรียน XYZ</Text>
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
          </Row>
        </div>

        <div className="highlight-section background-image">
          <Card className="highlight-card" bordered={false}>
            <Title level={3} style={{ color: "#ff9800" }}>ขอแสดงความยินดี! 🎉</Title>
            <Badge.Ribbon text="100/100" color="red">
              <Card hoverable className="winner-card" title="น้องบอส">
                <Text strong>โรงเรียน มอ.วิทยานุสรณ์</Text>
              </Card>
            </Badge.Ribbon>
          </Card>
        </div>

        <div className="section">
          <Title level={2}>คอร์สเรียนแนะนำ</Title>
          <Carousel autoplay dots={{ className: "carousel-dots" }}>
            <div><Card hoverable title="A-Level Course"><Text>รายละเอียดคอร์ส A-Level</Text></Card></div>
            <div><Card hoverable title="TPAT 3 Pro"><Text>ติวเข้ม TPAT 3</Text></Card></div>
            <div><Card hoverable title="GAT Master"><Text>เทคนิคทำข้อสอบ GAT</Text></Card></div>
          </Carousel>
        </div>

        <div className="section">
          <Title level={2}>รวมสิทธิพิเศษ</Title>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={6}>
              <Card hoverable title="แจกไฟล์ PDF" cover={<FileTextOutlined style={{ fontSize: 40 }} />} />
            </Col>
            <Col xs={24} sm={6}>
              <Card hoverable title="เงินคืน 2 เท่า" cover={<GiftOutlined style={{ fontSize: 40 }} />} />
            </Col>
            <Col xs={24} sm={6}>
              <Card hoverable title="ติวสดทุกสัปดาห์" cover={<VideoCameraOutlined style={{ fontSize: 40 }} />} />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
