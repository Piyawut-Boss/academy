import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'antd';
import './Course.css';

function Course() {
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAllCourses, setShowAllCourses] = useState({});

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(loggedInUser));
    } else {
      setIsLoggedIn(false);
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/courses?populate=*');
        const data = await response.json();
        setCourses(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      const fetchUserCourses = async () => {
        try {
          const response = await fetch(`http://localhost:1337/api/users/${user.id}?populate=courses`);
          const data = await response.json();
          if (data.data && data.data.courses) {
            setUserCourses(data.data.courses);
          } else {
            setUserCourses([]);
          }
        } catch (error) {
          console.error('Error fetching user courses:', error);
          setUserCourses([]);
        }
      };

      fetchUserCourses();
    }
  }, [isLoggedIn, user]);

  const toggleShowAllCourses = (category) => {
    setShowAllCourses(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูลคอร์ส...</p>;
  }

  // การตรวจสอบค่าก่อนใช้ flatMap
  const categories = Array.isArray(courses) && courses.length > 0
    ? [
        ...new Set(
          courses.flatMap(course =>
            Array.isArray(course.categories)
              ? course.categories.map(category => category.Category)
              : []  // ถ้า categories เป็น null หรือ undefined จะไม่ทำการ map
          )
        )
      ]
    : []; // กรณีที่ courses เป็น null หรือ array ว่าง จะให้ categories เป็น array ว่าง

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
                      <Button type="link" className="details-button">อ่านรายละเอียด</Button>
                      <Button type="primary" className="enroll-button">สมัครเรียน</Button>
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
            course.categories?.some(cat => cat.Category === category)  // ตรวจสอบว่า categories มีอยู่หรือไม่
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
                        <Button type="link" className="details-button">อ่านรายละเอียด</Button>
                        <Button type="primary" className="enroll-button">สมัครเรียน</Button>
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