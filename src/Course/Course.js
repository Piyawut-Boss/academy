import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Row, Col, Select, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './Course.css';

const useFetchCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/courses?populate=*");
        const data = await response.json();
        setCourses(data.data || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};

const useFetchCountDownData = () => {
  const [countDownData, setCountDownData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countDownResponse = await fetch("http://localhost:1337/api/count-downs");
        const countDownData = await countDownResponse.json();
        setCountDownData(countDownData.data || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { countDownData, loading, error };
};

function Course() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAllCourses, setShowAllCourses] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const { courses, loading: coursesLoading, error: coursesError } = useFetchCourses();
  const { countDownData, loading: countDownLoading, error: countDownError } = useFetchCountDownData();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleSubjectChange = useCallback((value) => {
    setSelectedSubject(value);
    const selectedExam = countDownData.find(exam => exam.id === value);
    if (selectedExam) {
      const now = moment();
      const examDate = moment(selectedExam.EndTime);
      const diffDays = examDate.diff(now, 'days');
      const diffHours = examDate.diff(now, 'hours') % 24;
      setRemainingTime(`เหลือเวลา ${diffDays} วัน ${diffHours} ชั่วโมง`);
    } else {
      setRemainingTime(null);
    }
  }, [countDownData]);

  useEffect(() => {
    if (countDownData.length > 0) {
      handleSubjectChange(countDownData[0].id); // เลือกวิชาแรกโดยอัตโนมัติ
    }
  }, [countDownData, handleSubjectChange]);

  const toggleShowAllCourses = useCallback((category) => {
    setShowAllCourses(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  const addToCart = useCallback((course) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const storedCartCourses = localStorage.getItem('cartCourses');
    const cartCourses = storedCartCourses ? JSON.parse(storedCartCourses) : [];
    cartCourses.push(course);
    localStorage.setItem('cartCourses', JSON.stringify(cartCourses));
    message.success(`${course.Title} has been added to your cart!`);
  }, [isLoggedIn, navigate]);

  const handleViewDetails = useCallback((course) => {
    setCurrentCourse(course);
    setIsModalVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    setCurrentCourse(null);
  }, []);

  if (coursesLoading || countDownLoading) {
    return <p>กำลังโหลดข้อมูลคอร์ส...</p>;
  }

  if (coursesError || countDownError) {
    return <p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>;
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

  // จัดลำดับ "Recommend" ให้อยู่บนสุด
  const sortedCategories = categories.sort((a, b) => {
    if (a === "Recommend") return -1;
    if (b === "Recommend") return 1;
    return 0;
  });

  return (
    <div className="course-container">
      <div className="selection-container">
        <h4>เลือกวิชาเพื่อดูเวลา count down:</h4>
        <Select
          value={selectedSubject}
          onChange={handleSubjectChange}
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder="เลือกวิชา"
        >
          {countDownData.map((exam) => (
            <Select.Option key={exam.id} value={exam.id}>
              {exam.ExamName}
            </Select.Option>
          ))}
        </Select>

        {remainingTime && <p style={{ marginTop: '10px' }}>{remainingTime}</p>}
      </div>

      <h1>คอร์สเรียนทั้งหมด</h1>
      {isLoggedIn ? (
        <div>
          <h2>คอร์สของฉัน</h2>
          {user?.courses?.length > 0 ? (
            <Row gutter={[16, 16]}>
              {user.courses.map((course) => {
                const { Title, Description, Price, realprice, id, Promotepic } = course;
                const imageUrl = Promotepic ? `http://localhost:1337${Promotepic.url}` : '';

                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={id}>
                    <Card
                      hoverable
                      cover={imageUrl ? (
                        <img alt={Title} src={imageUrl} />
                      ) : (
                        <div className="no-image">
                          <span>ไม่มีภาพ</span>
                        </div>
                      )}
                    >
                      <Card.Meta
                        title={<span className="course-card h3">{Title ?? 'ชื่อคอร์สไม่ระบุ'}</span>}
                        description={<span className="course-card p">{Description ?? 'รายละเอียดคอร์สไม่ระบุ'}</span>}
                      />
                      <div className="price">
                        <span className="price-original">{Price ? Price.toLocaleString() : 'ราคาปกติไม่ระบุ'} บาท</span>
                        <span className="price-discounted">{realprice ? realprice.toLocaleString() : 'ราคาหลังลดไม่ระบุ'} บาท</span>
                      </div>
                      <div className="buttons">
                        <Button type="link" className="details-button" onClick={() => handleViewDetails(course)}>
                          อ่านรายละเอียด
                        </Button>
                        <Button type="primary" className="enroll-button" onClick={() => navigate(`/study/${course.documentId}`)}>
                          ไปที่คอร์สของฉัน
                        </Button>
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
        {sortedCategories.map((category) => {
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
                        cover={imageUrl ? (
                          <img alt={Title} src={imageUrl} />
                        ) : (
                          <div className="no-image">
                            <span>ไม่มีภาพ</span>
                          </div>
                        )}
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
                          <Button type="link" className="details-button" onClick={() => handleViewDetails(course)}>
                            อ่านรายละเอียด
                          </Button>
                          <Button type="primary" className="enroll-button" onClick={() => addToCart(course)}>
                            เพิ่มลงตะกร้า
                          </Button>
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
      {currentCourse && (
        <Modal
          title={currentCourse.Title}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>ปิด</Button>,
            <Button key="submit" type="primary" onClick={() => addToCart(currentCourse)}>
              สมัครเรียน
            </Button>
          ]}
        >
          <p>{currentCourse.Detail}</p>
          <div className="unit-names">
            <h4>Units:</h4>
            {currentCourse.units && currentCourse.units.map(unit => (
              <p key={unit.id}>{unit.unitname}</p>
            ))}
          </div>
          <div className="price">
            <span className="price-original">{currentCourse.Price.toLocaleString()} บาท</span>
            <span className="price-discounted">{currentCourse.realprice.toLocaleString()} บาท</span>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Course;