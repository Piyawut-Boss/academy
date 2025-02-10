import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Carousel, Badge, Typography } from "antd";
import { TrophyOutlined, FileTextOutlined, GiftOutlined, VideoCameraOutlined } from "@ant-design/icons";
import './Home.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const [banners, setBanners] = useState([]);

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
  }, []);

  return (
    <Layout className="home-layout">
      <Content>
        <Carousel autoplay className="banner-carousel">
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
            <TrophyOutlined />
            <span style={{ color: 'black' }}>Team </span>
            <span style={{ color: '#473E91' }}>Tutor </span>
            <span style={{ color: '#FFC107  ' }}>HAPPYLearningAcademy</span>
          </Title>
          <Row gutter={[16, 16]} justify="center">
            {["พี่ A", "พี่ B", "พี่ C"].map((name, index) => (
              <Col key={index} xs={24} sm={8}>
                <Badge.Ribbon>
                  <Card hoverable className="leaderboard-card" title={name}>
                    <Text>โรงเรียน XYZ</Text>
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
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

        <div className="highlight-section">
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
