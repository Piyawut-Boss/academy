import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, message, Modal } from 'antd';
import './Course.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function CountdownSection() {
  const [countDownData, setCountDownData] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const fetchCountDownData = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/count-downs");
        const data = await response.json();
        setCountDownData(data.data || []);
      } catch (error) {
        console.error("Error fetching countdown data:", error);
      }
    };

    fetchCountDownData();
  }, []);

  useEffect(() => {
    if (!selectedExam) return;

    const exam = countDownData.find((exam) => exam.id === selectedExam);
    if (!exam) return;

    const updateCountdown = () => {
      const endTime = moment(exam.EndTime).toDate();
      const now = new Date();
      const diff = endTime - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        setTimeRemaining(`${days} days`);
      } else {
        setTimeRemaining("หมดเวลา");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [selectedExam, countDownData]);

  return (
    <div className="countdown-section">
      <h4>เลือกวันสอบ:</h4>
      <select
        value={selectedExam || ""}
        onChange={(e) => setSelectedExam(Number(e.target.value))}
        style={{ width: "100%", marginBottom: "20px" }}
      >
        <option value="" disabled>
          เลือกวันสอบ
        </option>
        {countDownData.map((exam) => (
          <option key={exam.id} value={exam.id}>
            {exam.ExamName}
          </option>
        ))}
      </select>

      {selectedExam && (
        <>
          <h5>Time Remaining:</h5>
          <p>{timeRemaining}</p>

          <div style={{ marginTop: "20px" }}>
            <h5>Exam Date:</h5>
            <p>
              {moment(countDownData.find((exam) => exam.id === selectedExam)?.EndTime)
                .locale("en")
                .format("dddd, D MMMM YYYY")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function Course() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAllCourses, setShowAllCourses] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [error, setError] = useState(null);

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
          console.log("Fetching user courses for user ID:", user.id);
          const response = await fetch(`http://localhost:1337/api/courses?filters[user][id][$eq]=${user.id}&populate=user`);
          const userCoursesData = await response.json();
          console.log("User courses data:", userCoursesData);

          const documentIds = userCoursesData.data.map(course => course.documentId);
          console.log("Document IDs:", documentIds);
          console.log(`Fetching course details for documentIds: ${documentIds.join(', ')}`);

          if (documentIds.length > 0) {
            console.log(`Fetching course details for documentIds: ${documentIds.join(', ')}`);
            const fetchCoursesDetails = await fetch(`http://localhost:1337/api/courses?filters[documentId][$in]=${documentIds.join('&filters[documentId][$in]=')}&populate=*`);
            console.log("API URL for fetching courses:", `http://localhost:1337/api/courses?filters[documentId][$in]=${documentIds.join('&filters[documentId][$in]=')}&populate=*`);
            const coursesDetailsData = await fetchCoursesDetails.json();
            console.log("Courses details data:", coursesDetailsData);
            console.log("User Courses Data: ", userCoursesData);
            console.log("Courses Details Response: ", coursesDetailsData);

            setUserCourses(coursesDetailsData.data || []);
          } else {
            console.log("No documentIds found for user courses.");
          }
        } catch (error) {
          console.error("Error fetching user courses:", error);
        }
      };

      fetchUserCourses();
    }
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    console.log(userCourses);
  }, [userCourses]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    message.success(`${course.Title} has been added to your cart!`);
  };

  const handleViewDetails = (course) => {
    setCurrentCourse(course);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentCourse(null);
  };

  const calculateDaysLeft = (endTime) => {
    if (!endTime) return "ไม่ระบุวันสิ้นสุด";
    const now = moment();
    const examDate = moment(endTime);
    const diffDays = examDate.diff(now, 'days');
    return diffDays > 0 ? `เหลือเวลา ${diffDays} วัน` : "หมดเวลาแล้ว";
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

  const sortedCategories = categories.sort((a, b) => {
    if (a === "Recommend") return -1;
    if (b === "Recommend") return 1;
    return 0;
  });

  return (
    <div className="course-container">
      <CountdownSection />

      <h1>คอร์สเรียนทั้งหมด</h1>
      {
        isLoggedIn ? (
          <div>
            <h2>คอร์สของฉัน</h2>
            {userCourses.length > 0 ? (
              <Row gutter={[16, 16]}>
                {userCourses.map((course) => {
                  const { Title, Description, Price, realprice, id, Promotepic, EndTime } = course;
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
                        <div className="time-left">
                          <p>{calculateDaysLeft(EndTime)}</p>
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
        {sortedCategories.map((category) => {
          const filteredCourses = courses.filter(course =>
            course.categories?.some(cat => cat.Category === category)
          );

          return (
            <div className="category-section" key={category}>
              <h3>{category}</h3>
              <Row gutter={[16, 16]}>
                {filteredCourses.slice(0, showAllCourses[category] ? filteredCourses.length : 4).map((course) => {
                  const { Title, Description, Price, realprice, id, Promotepic, EndTime } = course;
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
                        <div className="time-left">
                          <p>{calculateDaysLeft(EndTime)}</p>
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
            <p>{calculateDaysLeft(currentCourse?.EndTime)}</p>
          </Modal>
        )
      }
    </div>
  );
}

export default Course;