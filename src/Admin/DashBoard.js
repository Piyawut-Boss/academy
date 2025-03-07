import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Row, Col, Spin, Alert, Typography } from "antd";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from "recharts";
import { UserOutlined, DollarOutlined, RiseOutlined, BookOutlined } from "@ant-design/icons";
import "./DashBoard.css";
import config from '../config';

const API_BASE = config.apiBaseUrl;

const { Title, Text } = Typography;


function DashBoard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [newStudents, setNewStudents] = useState([]);
  const [revenue, setRevenue] = useState({ total: 0, monthly: 0 });
  const [categoryStats, setCategoryStats] = useState([]);

  const colors = {
    primary: "#1890ff",
    success: "#52c41a",
    warning: "#faad14",
    danger: "#ff4d4f",
    purple: "#722ed1",
    cyan: "#13c2c2",
    magenta: "#eb2f96",
    volcano: "#fa541c",
    gold: "#faad14",
  };

  const chartColors = [colors.primary, colors.success, colors.warning, colors.danger, colors.purple, colors.cyan, colors.magenta, colors.volcano, colors.gold];

  const formatCurrency = (value) => `฿${value.toLocaleString()}`;

  const fetchTotalUsers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/users?filters[role][name][$eq]=Authenticated`);
      if (data && data.data) {
        setTotalUsers(data.data.length);
      } else {
        setTotalUsers(data.length);
      }
    } catch (err) {
      console.error("Error fetching total users:", err);
      setError("Failed to fetch total users");
    }
  }, []);

  const fetchUserGrowth = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/users?filters[role][name][$eq]=Authenticated`);
      const usersData = data.data || data;
      const groupedData = groupByMonth(usersData);
      setUserGrowthData(groupedData);
    } catch (err) {
      console.error("Error fetching user growth data:", err);
      setError("Failed to fetch user growth data");
    }
  }, []);

  const fetchTopCourses = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/payments?filters[payment_status][$eq]=Approved&populate[0]=courses&populate[1]=user`
      );
      const payments = data.data || data;
      const topCourses = calculateTopCourses(payments);
      setTopCourses(topCourses);
    } catch (err) {
      console.error("Error fetching top courses:", err);
      setError("Failed to fetch top courses");
    }
  }, []);

  const fetchNewStudents = useCallback(async () => {
    try {
      const [approvedData, pendingData] = await Promise.all([
        axios.get(`${API_BASE}/api/payments?filters[payment_status][$eq]=Approved&populate=user`),
        axios.get(`${API_BASE}/api/payments?filters[payment_status][$eq]=Pending&populate=user`)
      ]);

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const filterPaymentsByCurrentMonth = (payments) => {
        return payments.filter((payment) => {
          const updatedAt = payment.attributes?.updatedAt || payment.updatedAt;
          if (updatedAt) {
            const updatedDate = new Date(updatedAt);
            return (
              updatedDate.getMonth() === currentMonth &&
              updatedDate.getFullYear() === currentYear
            );
          }
          return false;
        });
      };

      const approvedPayments = filterPaymentsByCurrentMonth(approvedData.data.data);
      const pendingPayments = filterPaymentsByCurrentMonth(pendingData.data.data);

      const approvedUsers = new Set();
      approvedPayments.forEach((payment) => {
        const userId = payment.attributes?.user?.data?.id || payment.user?.id;
        if (userId) {
          approvedUsers.add(userId);
        }
      });

      const pendingUsers = new Set();
      pendingPayments.forEach((payment) => {
        const userId = payment.attributes?.user?.data?.id || payment.user?.id;
        if (userId) {
          pendingUsers.add(userId);
        }
      });

      setNewStudents([
        { name: 'อนุมัติแล้ว', value: approvedUsers.size, fill: colors.success },
        { name: 'รออนุมัติ', value: pendingUsers.size, fill: colors.warning }
      ]);
    } catch (err) {
      console.error("Error fetching new students data:", err);
      setError("Failed to fetch new students data");
    }
  }, [colors.success, colors.warning]);

  const fetchRevenue = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/payments?filters[payment_status][$eq]=Approved`);
      const payments = data.data || data;
      const revenueData = calculateRevenue(payments);
      setRevenue(revenueData);
    } catch (err) {
      console.error("Error fetching revenue data:", err);
      setError("Failed to fetch revenue data");
    }
  }, []);

  const fetchCategoryStats = useCallback(async () => {
    try {
      const { data: coursesData } = await axios.get(`${API_BASE}/api/courses?populate=categories`);
      const { data: paymentsData } = await axios.get(`${API_BASE}/api/payments?filters[payment_status][$eq]=Approved&populate=courses`);

      const courses = coursesData.data || coursesData;
      const payments = paymentsData.data || paymentsData;

      const categoryStats = calculateCategoryStats(courses, payments);
      setCategoryStats(categoryStats);
    } catch (err) {
      console.error("Error fetching category stats:", err);
      setError("Failed to fetch category stats");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchTotalUsers(),
          fetchUserGrowth(),
          fetchTopCourses(),
          fetchNewStudents(),
          fetchRevenue(),
          fetchCategoryStats(),
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchCategoryStats, fetchNewStudents, fetchRevenue, fetchTopCourses, fetchUserGrowth, fetchTotalUsers]);

  const groupByMonth = (users = []) => {
    const monthlyData = {};
    users.forEach((user) => {
      const userData = user.attributes || user;
      const createdAt = userData.createdAt || userData.created_at;

      if (createdAt) {
        const month = new Date(createdAt).toLocaleString("en-US", { month: "short", year: "numeric" });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      }
    });

    return Object.keys(monthlyData)
      .sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      })
      .map((key) => ({ month: key, count: monthlyData[key] }));
  };

  const calculateTopCourses = (payments = []) => {
    const courseStats = {};
  
    payments.forEach((payment) => {
      const paymentData = payment.attributes || payment;
      const paymentStatus = paymentData.payment_status;
      const totalAmount = paymentData.totalAmount || 0;
      const courses = paymentData.courses?.data || paymentData.courses || [];
      const userId = paymentData.user?.data?.id || paymentData.user?.id;
  
      if (paymentStatus === "Approved" && courses.length > 0) {
        const course = courses[0].attributes || courses[0];
        const courseTitle = course.Title || "Unknown Course";
  
        if (!courseStats[courseTitle]) {
          courseStats[courseTitle] = {
            revenue: 0,
            users: new Set(), // ใช้ Set เพื่อเก็บ ID ผู้ใช้ที่ไม่ซ้ำกัน
          };
        }
  
        // เพิ่มรายได้และผู้ใช้
        courseStats[courseTitle].revenue += totalAmount;
        if (userId) {
          courseStats[courseTitle].users.add(userId);
        }
      }
    });
  
    // แปลงเป็น Array และเรียงลำดับตามรายได้จากมากไปน้อย
    return Object.entries(courseStats)
      .map(([courseTitle, data]) => ({
        courseTitle,
        revenue: data.revenue,
        userCount: data.users.size, // นับจำนวนผู้ใช้ที่ไม่ซ้ำกัน
      }))
      .sort((a, b) => b.revenue - a.revenue) // เรียงลำดับตามรายได้จากมากไปน้อย
      .slice(0, 5); // เลือกเฉพาะ 5 อันดับแรก
  };

  const calculateRevenue = (payments = []) => {
    let total = 0, monthly = 0;
    const thisMonth = new Date().getMonth();

    payments.forEach((payment) => {
      const paymentData = payment.attributes || payment;
      const paymentStatus = paymentData.payment_status;
      const totalAmount = paymentData.totalAmount || 0;
      const createdAt = paymentData.createdAt || paymentData.created_at;

      if (paymentStatus === "Approved") {
        total += totalAmount;
        if (createdAt && new Date(createdAt).getMonth() === thisMonth) {
          monthly += totalAmount;
        }
      }
    });

    return { total, monthly };
  };

  const calculateCategoryStats = (courses = [], payments = []) => {
    const categoryRevenue = {};

    const courseCategoryMap = {};

    courses.forEach((course) => {
      const courseData = course.attributes || course;
      const courseId = course.id;
      const categories = courseData.categories?.data || courseData.categories || [];

      if (categories.length > 0) {
        courseCategoryMap[courseId] = categories;
      }
    });

    payments.forEach((payment) => {
      const paymentData = payment.attributes || payment;
      const paymentStatus = paymentData.payment_status;
      const totalAmount = paymentData.totalAmount || 0;
      const courses = paymentData.courses?.data || paymentData.courses || [];

      if (paymentStatus === "Approved" && courses.length > 0) {
        const course = courses[0];
        const courseId = course.id;
        const categories = courseCategoryMap[courseId] || [];

        categories.forEach((category) => {
          const categoryData = category.attributes || category;
          const categoryName = categoryData.Category || categoryData.name || "Unknown Category";
          categoryRevenue[categoryName] = (categoryRevenue[categoryName] || 0) + totalAmount;
        });
      }
    });

    return Object.entries(categoryRevenue).map(([name, value]) => ({ name, value }));
  };



  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
        <Spin size="large" />
        <Text style={{ marginTop: 16 }}>กำลังโหลดข้อมูล Dashboard...</Text>
      </div>
    );
  }

  if (error) {
    return <Alert message="เกิดข้อผิดพลาด" description={error} type="error" showIcon style={{ margin: "20px" }} />;
  }

  const lineChartProps = {
    margin: { top: 5, right: 5, left: 0, bottom: 5 }
  };

  const pieChartProps = {
    margin: { top: 5, right: 5, left: 5, bottom: 5 }
  };

  const renderCustomizedLabel = ({ name, percent }) => {
    return percent > 0.05 ? `${name.substring(0, 8)}..` : '';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">

        <div className="row-container" style={{ flex: 0, minHeight: 'auto', marginBottom: '8px' }}>
          <Row gutter={[8, 8]} style={{ marginBottom: 0 }}>
            <Col xs={8}>
              <div className="stat-box">
                <UserOutlined className="stat-icon" style={{ color: colors.primary }} />
                <Text type="secondary" className="stat-label">นักเรียนทั้งหมด</Text>
                <div className="stat-value" style={{ color: colors.primary }}>{totalUsers.toLocaleString()}</div>
                <Text style={{ fontSize: '12px' }}>คน</Text>
              </div>
            </Col>

            <Col xs={8}>
              <div className="stat-box">
                <DollarOutlined className="stat-icon" style={{ color: colors.success }} />
                <Text type="secondary" className="stat-label">ยอดขายทั้งหมด</Text>
                <div className="stat-value" style={{ color: colors.success }}>{formatCurrency(revenue.total)}</div>
                <Text style={{ fontSize: '12px' }}>บาท</Text>
              </div>
            </Col>

            <Col xs={8}>
              <div className="stat-box">
                <RiseOutlined className="stat-icon" style={{ color: colors.danger }} />
                <Text type="secondary" className="stat-label">ยอดขายเดือนนี้</Text>
                <div className="stat-value" style={{ color: colors.danger }}>{formatCurrency(revenue.monthly)}</div>
                <Text style={{ fontSize: '12px' }}>บาท</Text>
              </div>
            </Col>
          </Row>
        </div>

        <div className="row-container">
          <Row gutter={[8, 8]}>
            <Col xs={16}>
              <div className="chart-container">
                <Title level={4} className="chart-title">แนวโน้มจำนวนนักเรียน</Title>
                <div className="chart-content">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData} {...lineChartProps}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={(v) => v.split(' ')[0]} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => [`${value} คน`, 'จำนวนนักเรียน']} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={colors.primary}
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        dot={{ r: 4, fill: 'white', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Col>

            <Col xs={8}>
              <div className="chart-container">
                <Title level={4} className="chart-title">นักเรียนใหม่เดือนนี้</Title>
                <div className="chart-content">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={newStudents} {...lineChartProps}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => [`${value} คน`, 'จำนวน']} />
                      <Bar dataKey="value" fill="#8884d8">
                        {newStudents.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div className="row-container">
          <Row gutter={[8, 8]}>
            <Col xs={12}>
              <div className="chart-container">
                <Title level={4} className="chart-title">สัดส่วนรายได้ตามหมวดหมู่</Title>
                <div className="chart-content">
                  {categoryStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart {...pieChartProps}>
                        <Pie
                          data={categoryStats.slice(0, 5)}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius="70%"
                          innerRadius="35%"
                          paddingAngle={2}
                          label={renderCustomizedLabel}
                          labelLine={false}
                        >
                          {categoryStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Text>ไม่มีข้อมูลสถิติหมวดหมู่</Text>
                    </div>
                  )}
                </div>
              </div>
            </Col>

            <Col xs={12}>
              <div className="chart-container">
                <Title level={4} className="chart-title">Top 5 คอร์สยอดนิยม</Title>
                <div className="scrollable-container">
                  {topCourses.map((course, index) => (
                    <div
                      key={index}
                      className="popular-course"
                      style={{
                        borderLeft: `3px solid ${chartColors[index % chartColors.length]}`,
                      }}
                    >
                      <div className="course-title">
                        <BookOutlined
                          style={{
                            marginRight: 4,
                            color: chartColors[index % chartColors.length],
                            fontSize: "12px",
                          }}
                        />
                        <Text style={{ fontSize: "12px" }}>{course.courseTitle}</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: "10px",marginLeft:"auto" }}>
                        ผู้เรียน: {course.userCount} คน
                      </Text>
                      <Text strong style={{ color: colors.success, fontSize: "12px",marginLeft:"10px" }}>
                        {formatCurrency(course.revenue)}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="footer">
        <Text type="secondary" style={{ fontSize: '11px' }}>
          © {new Date().getFullYear()} Admin Dashboard - อัพเดทล่าสุด: {new Date().toLocaleString('th-TH')}
        </Text>
      </div>
    </div>
  );
}

export default DashBoard;