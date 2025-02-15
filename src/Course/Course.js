import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'antd';
import './Course.css';
import { useNavigate } from 'react-router-dom';  // นำเข้า useNavigate

function Course() {
  const navigate = useNavigate();  // กำหนด navigate
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAllCourses, setShowAllCourses] = useState({});

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    console.log("Logged in user from localStorage:", loggedInUser);

    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      console.log('Logged in user:', parsedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // ดึงคอร์สทั้งหมด
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/courses?populate=*");
        const data = await response.json();
        console.log("Fetched user courses:", data);
        setCourses(data.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ดึงคอร์สของผู้ใช้
  useEffect(() => {
    if (isLoggedIn && user?.username) {
      const fetchUserCourses = async () => {
        try {
          const response = await fetch(
            `http://localhost:1337/api/courses?filters[users][username][$eq]=${user.username}&populate=*`
          );
          const data = await response.json();
          console.log("User courses:", data); // ตรวจสอบข้อมูล
          setUserCourses(data.data || []);
        } catch (error) {
          console.error("Error fetching user courses:", error);
          setUserCourses([]);
        }
      };

      fetchUserCourses();
    }
  }, [isLoggedIn, user?.username]);

  const toggleShowAllCourses = (category) => {
    setShowAllCourses(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const addToCart = (course) => {
    if (!isLoggedIn) {
      navigate("/login"); // หากผู้ใช้ไม่ได้ล็อกอิน จะนำผู้ใช้ไปที่หน้าล็อกอิน
      return;
    }
    const storedCartCourses = localStorage.getItem('cartCourses');
    const cartCourses = storedCartCourses ? JSON.parse(storedCartCourses) : [];
    cartCourses.push(course);  // เพิ่มคอร์สที่เลือกลงในตะกร้า
    localStorage.setItem('cartCourses', JSON.stringify(cartCourses));  // เก็บข้อมูลตะกร้าใน localStorage
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูลคอร์ส...</p>;
  }

  const categories = Array.isArray(courses) && courses.length > 0
    ? [
      ...new Set(
        courses.flatMap(course =>
          Array.isArray(course.categories)
            ? course.categories.map(category => category.Category)
            : []
        )
      )
    ]
    : [];

  console.log("Categories:", categories);
  return (
    <div className="course-container">
      <h1>คอร์สเรียนทั้งหมด</h1>

      {isLoggedIn ? (
        <div>
          <h2>คอร์สของฉัน</h2>
          {userCourses.length > 0 ? (
            <Row gutter={[16, 16]}>
              {userCourses.map((course) => {
                const { Title, Description, Price, realprice, id, Promotepic } = course;
                const imageUrl = Promotepic ? `http://localhost:1337${Promotepic.url}` : '';

                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={id}>
                    <Card
                      hoverable
                      cover={
                        imageUrl ? (
                          <img alt={Title} src={imageUrl} />
                        ) : (
                          <div className="no-image">
                            <span>ไม่มีภาพ</span>
                          </div>
                        )
                      }
                    >
                      <Card.Meta
                        title={Title ?? 'ชื่อคอร์สไม่ระบุ'}
                        description={Description ?? 'รายละเอียดคอร์สไม่ระบุ'}
                      />
                      <div className="price">
                        <span className="price-original">{Price ? Price.toLocaleString() : 'ราคาปกติไม่ระบุ'} บาท</span>
                        <span className="price-discounted">{realprice ? realprice.toLocaleString() : 'ราคาหลังลดไม่ระบุ'} บาท</span>
                      </div>
                      <div className="buttons">
                        <Button type="link" className="details-button">อ่านรายละเอียด</Button>
                        <Button type="primary" className="enroll-button" onClick={() => addToCart(course)}>สมัครเรียน</Button>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <p>ยังไม่มีคอร์สในรายการของคุณ</p>
          )}
        </div>
      ) : (
        <p>กรุณาล็อกอินเพื่อดูคอร์สของคุณ</p>
      )}

      <h2>คอร์สเรียนทั้งหมด</h2>
      <div className="category-section">
        {categories.map((category) => {
          const filteredCourses = courses.filter(course =>
            course.categories?.some(cat => cat.Category === category)
          );

          return (
            <div className="category-section" key={category}>
              <h3>{category}</h3>
              <Row gutter={[16, 16]}>
                {filteredCourses.slice(0, showAllCourses[category] ? filteredCourses.length : 4).map((course) => {
                  const { Title, Description, Price, realprice, id, Promotepic } = course;
                  const imageUrl = Promotepic ? `http://localhost:1337${Promotepic.url}` : '';

                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={id}>
                      <Card
                        hoverable
                        cover={
                          imageUrl ? (
                            <img alt={Title} src={imageUrl} />
                          ) : (
                            <div className="no-image">
                              <span>ไม่มีภาพ</span>
                            </div>
                          )
                        }
                      >
                        <Card.Meta
                          title={Title ?? 'ชื่อคอร์สไม่ระบุ'}
                          description={Description ?? 'รายละเอียดคอร์สไม่ระบุ'}
                        />
                        <div className="price">
                          <span className="price-original">{Price ? Price.toLocaleString() : 'ไม่ระบุราคา'} บาท</span>
                          <span className="price-discounted">{realprice ? realprice.toLocaleString() : 'ไม่ระบุราคา'} บาท</span>
                        </div>
                        <div className="buttons">
                          <Button type="link" className="details-button">อ่านรายละเอียด</Button>
                          <Button type="primary" className="enroll-button" onClick={() => addToCart(course)}>เพิ่มลงตะกร้า</Button>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
              {filteredCourses.length > 4 && (
                <div className="show-more" onClick={() => toggleShowAllCourses(category)}>
                  <span>{showAllCourses[category] ? 'ซ่อน' : 'แสดงทั้งหมด'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Course;
