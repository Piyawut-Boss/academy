import React, { useState, useEffect } from 'react';
import './User.css';
import { Button, Card, Row, Col, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const API_BASE = config.apiBaseUrl;
const token = config.apiToken;


function User() {
  const [user, setUser] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [showHeart, setShowHeart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      setError('Please log in to view your profile');
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      const fetchUserCourses = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_BASE}/api/courses?filters[user][id][$eq]=${user.id}&populate=user`);
          if (!response.ok) {
            throw new Error('Failed to fetch user courses');
          }
          const userCoursesData = await response.json();

          const documentIds = userCoursesData.data.map(course => course.documentId);
          if (documentIds.length > 0) {
            const fetchCoursesDetails = await fetch(`${API_BASE}/api/courses?filters[documentId][$in]=${documentIds.join('&filters[documentId][$in]=')}&populate=*`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (!fetchCoursesDetails.ok) {
              throw new Error('Failed to fetch course details');
            }
            const coursesDetailsData = await fetchCoursesDetails.json();
            setUserCourses(coursesDetailsData.data || []);
          } else {
            setUserCourses([]);
          }
        } catch (error) {
          console.error('Error fetching user courses:', error);
          setError('Error fetching data');
        } finally {
          setLoading(false);
        }
      };

      fetchUserCourses();
    }
  }, [user?.id]);

  const handleClick = () => {
    setShowHeart(true);
    setTimeout(() => {
      setShowHeart(false);
    }, 1500);
  };

  const handleViewDetails = (course) => {
    setCurrentCourse(course);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentCourse(null);
  };

  if (error) {
    return <div className="error-message"><h2>{error}</h2></div>;
  }

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="user-details-card">
        <div className="profile-grid">
          <div className="profile-info">
            <div className="profile-header">
              <div className="profile-circle" onClick={handleClick}>
                <span className="smiley-face">😊</span>
                {showHeart && <span className="heart">❤️</span>}
              </div>
              <div className="profile-text">
                <h1 className="profile-name">{user.username}</h1>
                <p className="profile-email">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="profile-stats-grid">
            <div className="stat-card">
              <span className="stat-number">{userCourses.length}</span>
              <span className="stat-label">Enrolled Courses</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">0</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>
      </div>

      <h2>คอร์สของฉัน</h2>
      {loading ? (
        <p>Loading your courses...</p>
      ) : (
        <Row gutter={[16, 16]}>
          {userCourses.length > 0 ? (
            userCourses.map((course) => {
              const { Title, Description, Price, realprice, id, Promotepic } = course;
              const imageUrl = Promotepic ? `${API_BASE}${Promotepic.url}` : '';

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={id}>
                  <Card
                    hoverable
                    cover={imageUrl ? <img alt={Title} src={imageUrl} /> : <div className="no-image"><span>No Image</span></div>}
                  >
                    <Card.Meta
                      title={Title ?? 'No title provided'}
                      description={Description ? `${Description.slice(0, 100)}...` : 'รายละเอียดคอร์สไม่ระบุ'}
                    />
                    <div className="price">
                      <span className="price-original">{Price ? `${Price.toLocaleString()} บาท` : 'No price available'}</span>
                      <span className="price-discounted">{realprice ? `${realprice.toLocaleString()} บาท` : 'No discount price available'}</span>
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
            })
          ) : (
            <p>You haven't enrolled in any courses yet.</p>
          )}
        </Row>
      )}

      {/* Modal for course details */}
      {currentCourse && (
        <Modal
          title={currentCourse.Title}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>Close</Button>,
            <Button key="submit" type="primary" onClick={() => navigate(`/course/${currentCourse.id}`)}>
              Go to Course
            </Button>
          ]}
        >
          <p>{currentCourse.Description}</p>
          <div className="unit-names">
            <h4>Units:</h4>
            {currentCourse.units && currentCourse.units.map(unit => (
              <p key={unit.id}>{unit.unitname}</p>
            ))}
          </div>
          <div className="price">
            <span className="price-original">{currentCourse.Price?.toLocaleString() ?? 'No price'} บาท</span>
            <span className="price-discounted">{currentCourse.realprice?.toLocaleString() ?? 'No discount price'} บาท</span>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default User;