import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Carousel, Typography, Button, FloatButton } from "antd";
import { UpOutlined, TeamOutlined, TrophyOutlined, BookOutlined, PhoneOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import myImage from '../images/in.png';
import fbImage from '../images/facebook.png';
import lineImage from '../images/line.png';
import igImage from '../images/instagram.png';
import ytImage from '../images/youtube.png';

import './Home.css';

const { Content } = Layout;
const { Title, Text } = Typography;
const API_BASE = process.env.REACT_APP_API_BASE_URL;


const Home = () => {
  const [banners, setBanners] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [congracts, setCongracts] = useState([]);
  const [congrate2s, setCongrate2s] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [showFloatButtons, setShowFloatButtons] = useState(false);

  const addToCart = (course) => {
    const storedCartCourses = localStorage.getItem('cartCourses');
    const cartCourses = storedCartCourses ? JSON.parse(storedCartCourses) : [];
    cartCourses.push(course);
    localStorage.setItem('cartCourses', JSON.stringify(cartCourses));
  };

  useEffect(() => {
    // Banners
    fetch(`${API_BASE}/api/banners?populate=*`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const bannerImages = data.data.map((item) => {
            const banner = item.Banner;
            let imageUrl = banner.url ? `${API_BASE}` + banner.url : "https://via.placeholder.com/1200x250";
            return { id: item.id, imageUrl: imageUrl };
          });
          setBanners(bannerImages);
        }
      })
      .catch((error) => console.error("Error fetching banners:", error));

    // Tutors
    fetch(`${API_BASE}/api/tutors?populate=image`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const tutorImageData = data.data.map((item) => {
            const imageUrl = item.image?.url
              ? `${API_BASE}` + item.image.url
              : "https://via.placeholder.com/150";
            return { id: item.id, name: item.Name, imageUrl: imageUrl };
          });
          setTutors(tutorImageData);
        }
      })
      .catch((error) => console.error("Error fetching tutors image:", error));

    // Congracts
    fetch(`${API_BASE}/api/congracts?populate=*`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const congractImages = data.data.map((item) => {
            const imageUrl = item.image?.url
              ? `${API_BASE}` + item.image.url
              : "https://via.placeholder.com/150";
            return { id: item.id, name: item.name, imageUrl: imageUrl };
          });
          setCongracts(congractImages);
        }
      })
      .catch((error) => console.error("Error fetching congracts images:", error));

    // Congrate2
    fetch(`${API_BASE}/api/congrate2s?populate=*`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          const congrate2Data = data.data.map((item) => ({
            id: item.id,
            name: item.name,
            imageUrl: item.image?.url ? `${API_BASE}` + item.image.url : "https://via.placeholder.com/150",
          }));
          setCongrate2s(congrate2Data);
        }
      })
      .catch((error) => console.error("Error fetching congrate2s:", error));

    // Recommended
    fetch(`${API_BASE}/api/courses?populate=*`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const recommendedCourses = data.data.filter(course =>
            course.categories?.some(category => category.Category === "Recommend")
          ).map((item) => {
            const imageUrl = item.Promotepic?.url
              ? `${API_BASE}${item.Promotepic.url}`
              : "https://via.placeholder.com/150";
            return {
              id: item.id,
              title: item.Title,
              description: item.Description,
              price: item.Price,
              realprice: item.realprice,
              imageUrl: imageUrl,
            };
          });
          setRecommendedCourses(recommendedCourses);
        }
      })
      .catch((error) => console.error("Error fetching recommended courses:", error));

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

        <div className="section" id="team-section">
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
              tutors.map((tutor, index) => (
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

        <div className="section" id="congracts-section">
          <Title level={1}>
            <span className="std-container">
              <span className="congrate-text">ขอแสดงความยินดี</span>
              <span className="std-text">กับเหล่าลูกศิษย์ ของพี่ติวเตอร์</span>
            </span>
          </Title>
          <Carousel autoplay slidesToShow={1}>
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

        <div className="section" id="congrate2-section">
          <Carousel autoplay slidesToShow={4} dots={false}>
            {congrate2s.length > 0 ? (
              congrate2s.map((congrate) => (
                <div key={congrate.id} className="std2-carousel-item">
                  <img
                    src={congrate.imageUrl}
                    alt={`แสดงความยินดี ${congrate.name}`}
                    className="std2-image"
                  />
                </div>
              ))
            ) : (
              <div><Text>ไม่มีข้อมูลของนักเรียน</Text></div>
            )}
          </Carousel>
        </div>

        <div className="image-container">
          <img src={myImage} alt="" />
        </div>

        <div className="section" id="courses-section">
          <Title level={1}>
            <span className="team-container">
              <span className="Course-text">Course </span>
              <span className="Recommend-text">Recommend</span>
            </span>
          </Title>
          <p className="cc-description">สอบเข้ามหาลัยฯ ไปด้วยกัน !!</p>

          <Row gutter={[16, 16]}>
            {recommendedCourses.length > 0 ? (
              recommendedCourses.slice(0, 4).map((course) => {
                const { title, description, price, realprice, id, imageUrl } = course;
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={id}>
                    <Card
                      hoverable
                      cover={imageUrl ? (
                        <img alt={title} src={imageUrl} />
                      ) : (
                        <div className="no-image">
                          <span>ไม่มีภาพ</span>
                        </div>
                      )}
                    >
                      <Card.Meta
                        title={title ?? 'ชื่อคอร์สไม่ระบุ'}
                        description={description ?? 'รายละเอียดคอร์สไม่ระบุ'}
                      />
                      <div className="price">
                        <span className="price-original">{price ? price.toLocaleString() : 'ราคาปกติไม่ระบุ'} บาท</span>
                        <span className="price-discounted">{realprice ? realprice.toLocaleString() : 'ราคาหลังลดไม่ระบุ'} บาท</span>
                      </div>
                      <div className="buttons">
                        <Button type="link" className="details-button">อ่านรายละเอียด</Button>
                        <Button type="primary" className="enroll-button" onClick={() => addToCart(course)}>สมัครเรียน</Button>
                      </div>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <div><Text>ไม่พบข้อมูลคอร์สที่แนะนำ</Text></div>
            )}
          </Row>
        </div>

        <div className="contact-section" id="contact-section">
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

        <FloatButton
          icon={showFloatButtons ? <CloseOutlined /> : <PlusOutlined />}
          tooltip={showFloatButtons ? "Close Navigation" : "Show Navigation"}
          onClick={() => setShowFloatButtons(!showFloatButtons)}
          style={{ right: 24, bottom: 80 }}
        />

        {showFloatButtons && (
          <FloatButton.Group
            shape="circle"
            direction="up"
            style={{ right: 24, bottom: 140 }}
            gap={10}
          >
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
                section && window.scrollTo({ top: section.offsetTop - 100, behavior: "smooth" });
              }}
            />
            <FloatButton
              icon={<TrophyOutlined />}
              tooltip="Student Congratulation"
              onClick={() => {
                const section = document.getElementById("congracts-section");
                section && window.scrollTo({ top: section.offsetTop - 100, behavior: "smooth" });
              }}
            />
            <FloatButton
              icon={<BookOutlined />}
              tooltip="Courses"
              onClick={() => {
                const section = document.getElementById("courses-section");
                section && window.scrollTo({ top: section.offsetTop - 100, behavior: "smooth" });
              }}
            />
            <FloatButton
              icon={<PhoneOutlined />}
              tooltip="Contact"
              onClick={() => {
                const section = document.getElementById("contact-section");
                section && window.scrollTo({ top: section.offsetTop - 100, behavior: "smooth" });
              }}
            />
          </FloatButton.Group>
        )}
      </Content>
    </Layout>
  );
};

export default Home;