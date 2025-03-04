import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Carousel, Typography, Button, FloatButton, message, Modal } from "antd";
import { UpOutlined, TeamOutlined, TrophyOutlined, BookOutlined, PhoneOutlined, PlusOutlined, CloseOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import myImage from '../images/in.png';
import fbImage from '../images/facebook.png';
import lineImage from '../images/line.png';
import igImage from '../images/instagram.png';
import ytImage from '../images/youtube.png';
import { useNavigate } from 'react-router-dom';

import './Home.css';

const { Content } = Layout;
const { Title, Text } = Typography;
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [banners, setBanners] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [congracts, setCongracts] = useState([]);
  const [congrate2s, setCongrate2s] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [showFloatButtons, setShowFloatButtons] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('user');
    setIsLoggedIn(loggedInStatus === 'true');
  }, []);

  const addToCart = (course) => {
    const loggedInUser = localStorage.getItem("user");

    // ถ้าผู้ใช้ไม่ได้ล็อกอินให้ไปหน้าล็อกอิน
    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    // ดึงข้อมูลตะกร้าจาก localStorage
    const cartCourses = JSON.parse(localStorage.getItem('cartCourses')) || [];

    // ตรวจสอบว่าคอร์สนี้มีในตะกร้าแล้วหรือไม่
    if (cartCourses.some(item => item.id === course.id)) {
      message.warning(`${course.title} มีในตะกร้าแล้ว`);
      return;
    }

    console.log(cartCourses);

    // สร้างข้อมูลคอร์สที่จะเพิ่มลงตะกร้า
    const courseToAdd = {
      id: course.id,
      Title: course.title || 'N/A',
      Description: course.description || 'ไม่มีรายละเอียด',
      Price: course.price || 0,
      realprice: course.realprice || 0,
      Promotepic: course.Promotepic || {
        url: 'https://via.placeholder.com/150',
        name: 'default-course-image'
      },
      categories: course.categories || []
    };

    // เพิ่มคอร์สลงในตะกร้า
    cartCourses.push(courseToAdd);
    localStorage.setItem('cartCourses', JSON.stringify(cartCourses));

    // อัพเดตจำนวนคอร์สในตะกร้า
    setCartCount(cartCourses.length);

    // แสดงข้อความเมื่อเพิ่มคอร์สลงตะกร้า
    message.success(`${courseToAdd.Title} ได้ถูกเพิ่มลงในตะกร้าแล้ว`);
  };

  const handleViewDetails = (course) => {
    setCurrentCourse(course);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentCourse(null);
  };

  useEffect(() => {
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
  }, []);

  // ดึงข้อมูล Tutors
  useEffect(() => {
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
  }, []);

  // ดึงข้อมูล Congracts
  useEffect(() => {
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
  }, []);

  // ดึงข้อมูล Congrate2
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/courses?populate=*`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
              Promotepic: item.Promotepic
                ? {
                  url: `${API_BASE}${item.Promotepic.url}`,
                  name: item.Promotepic.name || 'course-image'
                }
                : null,
              imageUrl: imageUrl,
              categories: item.categories || []
            };
          });
          setRecommendedCourses(recommendedCourses);
        }
      })
      .catch((error) => console.error("Error fetching recommended courses:", error));
  }, []);

  // อัปเดตจำนวนสินค้าในตะกร้าเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    const storedCartCourses = localStorage.getItem('cartCourses');
    const cartCourses = storedCartCourses ? JSON.parse(storedCartCourses) : [];
    setCartCount(cartCourses.length);
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
            {recommendedCourses.slice(0, 4).map((course) => (
              <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                <Card
                  hoverable
                  cover={<img alt={course.title} src={course.imageUrl} />}
                >
                  <Card.Meta
                    title={course.title ?? 'ชื่อคอร์สไม่ระบุ'}
                    description={course.description ?? 'รายละเอียดคอร์สไม่ระบุ'}
                  />
                  <div className="price">
                    <span className="price-original">{course.price ? course.price.toLocaleString() : 'ราคาปกติไม่ระบุ'} บาท</span>
                    <span className="price-discounted">{course.realprice ? course.realprice.toLocaleString() : 'ราคาหลังลดไม่ระบุ'} บาท</span>
                  </div>
                  <div className="buttons">
                    <Button type="link" className="details-button" onClick={() => handleViewDetails(course)}>อ่านรายละเอียด</Button>
                    <Button type="primary" className="enroll-button" onClick={() => addToCart(course)}>เพิ่มลงตะกร้า</Button>
                  </div>
                </Card>
              </Col>
            ))}
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

        {currentCourse && (
          <Modal
            title={currentCourse.title}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>ปิด</Button>,
              <Button key="submit" type="primary" onClick={() => addToCart(currentCourse)}>
                สมัครเรียน
              </Button>
            ]}
          >
            <p>{currentCourse.description}</p>
            <div className="unit-names">
              <h4>Units:</h4>
              {currentCourse.units && currentCourse.units.map(unit => (
                <p key={unit.id}>{unit.unitname}</p>
              ))}
            </div>
            <div className="price">
              <span className="price-original">{currentCourse.price.toLocaleString()} บาท</span>
              <span className="price-discounted">{currentCourse.realprice.toLocaleString()} บาท</span>
            </div>
          </Modal>
        )}
      </Content>
    </Layout>
  );
};

export default Home;