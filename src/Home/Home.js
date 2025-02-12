import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Carousel, Typography } from "antd";
import { FileTextOutlined, GiftOutlined, VideoCameraOutlined } from "@ant-design/icons";
import './Home.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [congracts, setCongracts] = useState([]);
  const [congrate2s, setCongrate2s] = useState([]);



  useEffect(() => {
    fetch("http://localhost:1337/api/banners?populate=*")
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const bannerImages = data.data.map((item) => {
            const banner = item.Banner;
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
              name: item.Name,
              imageUrl: imageUrl,
            };
          });

          console.log("Tutor Image Data:", tutorImageData);
          setTutors(tutorImageData);
        }
      })
      .catch((error) => console.error("Error fetching tutors image:", error));


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

    fetch("http://localhost:1337/api/congracts?populate=*")
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const congractImages = data.data.map((item) => {
            const imageUrl = item.image?.url
              ? "http://localhost:1337" + item.image.url
              : "https://via.placeholder.com/150";
            return {
              id: item.id,
              name: item.name,
              imageUrl: imageUrl,
            };
          });
          setCongracts(congractImages);
        }
      })
      .catch((error) => console.error("Error fetching congracts images:", error));

    fetch("http://localhost:1337/api/congrate2s?populate=*")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          const congrate2Data = data.data.map((item) => ({
            id: item.id,
            name: item.name,
            imageUrl: item.image?.url ? "http://localhost:1337" + item.image.url : "https://via.placeholder.com/150",
          }));
          setCongrate2s(congrate2Data);
        }
      })
      .catch((error) => console.error("Error fetching congrate2s:", error));

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
            <span className="team-container">
              <span className="team-text">Team</span>
              <span className="tutor-text">Tutor</span>
              <span className="academy-text">HAPPYLearningAcademy</span>
            </span>
          </Title>
          <p className="team-description">สอนสนุก อธิบายละเอียดยิบ เทคนิคจัดเต็ม !!</p>

          <Carousel autoplay slidesToShow={4} dots={false}>
            {tutors.length > 0 ? (
              tutors.map((tutor,) => (
                <div key={tutor.id} className="tutor-carousel-item">
                  <img
                    src={tutor.imageUrl}
                    alt={`รูปติวเตอร์ ${tutor.name}`}
                    className="tutor-image"
                  />

                </div>
              ))
            ) : (
              <div><Text>ไม่มีข้อมูลของติวเตอร์</Text></div>
            )}
          </Carousel>
        </div>

        <div className="section">
          <Title level={1}>
            <span className="std-container">
              <span className="congrate-text">ขอแสดงความยินดี</span>
              <span className="std-text">กับเหล่าลูกศิษย์ ของพี่ติวเตอร์</span>
            </span>
          </Title>

          <Carousel autoplay slidesToShow={1} >
            {congracts.length > 0 ? (
              congracts.map((congract) => (
                <div key={congract.id} className="congract-carousel-item">
                  <img
                    src={congract.imageUrl}
                    alt={`รูปแสดงความยินดี ${congract.name}`}
                    className="congract-image"
                  />
                </div>
              ))
            ) : (
              <div><Text>ไม่มีข้อมูลของลูกศิษย์</Text></div>
            )}
          </Carousel>
        </div>

        <div className="section">
          <Carousel autoplay slidesToShow={4} dots={false}>
            {congrate2s.length > 0 ? (
              congrate2s.map((congrate) => (
                <div key={congrate.id} className="std2-carousel-item">
                  <span className="std2-container"></span>
                    <img src={congrate.imageUrl} 
                    alt={`แสดงความยินดี ${congrate.name}`} 
                    className="std2-image" />

                </div>
              ))
            ) : (
              <div><Text>ไม่มีข้อมูลของนักเรียน</Text></div>
            )}
          </Carousel>
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
