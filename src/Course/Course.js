import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Select, message, Modal, DatePicker, Checkbox } from 'antd';
import './Course.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function Course() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAllCourses, setShowAllCourses] = useState({});
  const [countDownData, setCountDownData] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [categoryData, setCategoryData] = useState([]);

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/courses?populate=*");
        const data = await response.json();
        setCourses(data.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      const fetchUserCourses = async () => {
        try {
          const response = await fetch(`http://localhost:1337/api/users/${user.id}?populate=courses`);
          const data = await response.json();
          setUserCourses(data.courses || []);
        } catch (error) {
          console.error("Error fetching user courses:", error);
        }
      };

      fetchUserCourses();
    }
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countDownResponse = await fetch("http://localhost:1337/api/count-downs");
        const countDownData = await countDownResponse.json();
        setCountDownData(countDownData.data || []);

        const categoryResponse = await fetch("http://localhost:1337/api/categories");
        const categoryData = await categoryResponse.json();
        setCategoryData(categoryData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("ไม่สามารถดึงข้อมูลได้");
      }
    };

    fetchData();
  }, []);

  const handleExamChange = (value) => {
    setSelectedExam(value);
    calculateRemainingTime(selectedStartDate, value);
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    calculateRemainingTime(date, selectedExam);
  };

  const handleSubjectsChange = (checkedValues) => {
    setSelectedSubjects(checkedValues);
  };

  const calculateRemainingTime = (startDate, examId) => {
    if (!startDate || !examId) return;

    const exam = countDownData.find(exam => exam.id === examId);
    if (!exam || !exam.EndTime) return;

    const examDate = moment(exam.EndTime);
    const diffDays = examDate.diff(moment(startDate), 'days');
    const diffHours = examDate.diff(moment(startDate), 'hours') % 24;

    setRemainingTime(`เหลือเวลาเรียนประมาณ ${diffDays} วัน ${diffHours} ชั่วโมง`);
  };

  const toggleShowAllCourses = (category) => {
    setShowAllCourses(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const addToCart = (course) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const storedCartCourses = localStorage.getItem('cartCourses');
    const cartCourses = storedCartCourses ? JSON.parse(storedCartCourses) : [];
    cartCourses.push(course);
    localStorage.setItem('cartCourses', JSON.stringify(cartCourses));
  };

  const handleViewDetails = (course) => {
    setCurrentCourse(course);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentCourse(null);
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

  return (
    <div className="course-container">
      <div className="selection-container">
        <h4>เลือกวันสอบ:</h4>
        <Select
          value={selectedExam}
          onChange={handleExamChange}
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder="เลือกวันสอบ"
        >
          {countDownData.map((exam) => (
            <Select.Option key={exam.id} value={exam.id}>
              {exam.ExamName}
            </Select.Option>
          ))}
        </Select>

        <h4>เลือกวันที่คาดว่าจะเริ่มเรียน:</h4>
        <DatePicker
          style={{ width: '100%', marginBottom: '10px' }}
          onChange={handleStartDateChange}
        />

        <Checkbox.Group
          options={categoryData.map((category) => category.Category)}
          onChange={handleSubjectsChange}
        />

        {remainingTime && <p style={{ marginTop: '10px' }}>{remainingTime}</p>}
      </div>

      <h1>คอร์สเรียนทั้งหมด</h1>
      {
        isLoggedIn ? (
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
        )
      }
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
      {
        currentCourse && (
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
        )
      }
    </div>
  );
}

export default Course;