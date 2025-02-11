import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import { FacebookOutlined, LineOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import happyLearningLogo from './Header/happy-learning-logo.png'; // นำเข้าโลโก้

const { Footer } = Layout;
const { Title, Text } = Typography;

const AppFooter = () => {
    return (
        <Footer style={styles.footerContainer}>
            <div style={styles.footerContent}>
                <Row gutter={[40, 20]} justify="space-between">
                    {/* ✅ คอลัมน์ซ้าย */}
                    <Col xs={24} md={12} style={styles.leftSection}>
                        <img src={happyLearningLogo} alt="Happy Learning Logo" style={styles.logo} />
                        <Title level={4} style={{ color: 'white' }}>Happy Learning Academy</Title>
                        <Text style={styles.text}>
                            สถาบันกวดวิชาที่มุ่งมั่นพัฒนาและส่งเสริมศักยภาพของเด็กไทย 
                            ด้วยการเรียนการสอนที่สนุก เข้าใจง่าย และเต็มไปด้วยเทคนิคที่ช่วยให้น้อง ๆ 
                            พร้อมเผชิญทุกความท้าทาย เรามีทีมงานมืออาชีพที่ใส่ใจทุกเป้าหมาย 
                            เพื่อให้น้อง ๆ ก้าวสู่ความสำเร็จได้อย่างมั่นใจ และมีความสุขในการเรียนรู้
                        </Text>
                    </Col>

                    {/* ✅ คอลัมน์ขวา (มีเส้นแบ่ง) */}
                    <Col xs={24} md={10} style={styles.rightSection}>
                        <Title level={4} style={{ color: 'white' }}>Contact Us</Title>
                        <Text style={styles.text}>
                            <EnvironmentOutlined /> xx/xx ถนนปุณณกันต์ ตำบลคอหงส์<br />
                             อำเภอหาดใหญ่ จังหวัดสงขลา 90110<br />
                            <PhoneOutlined /> 0xx xxx xxxx
                        </Text>

                        <Title level={4} style={{ color: 'white', marginTop: '20px' }}>Social Media</Title>
                        <Text style={styles.text}>
                            <FacebookOutlined /> Happy Learning Academy <br />
                            <LineOutlined /> @HappyLearning
                        </Text>
                    </Col>
                </Row>
            </div>
        </Footer>
    );
};

const styles = {
    footerContainer: {
        backgroundColor: '#777777',
        color: 'white',
        textAlign: 'center',
        padding: '30px 50px',
    },
    footerContent: {
        marginTop: '20px',
        textAlign: 'left',
    },
    leftSection: {
        paddingRight: '20px', 
    },
    rightSection: {
        borderLeft: '2px solid white', 
        paddingLeft: '100px', 
    },
    logo: {
        height: '120px',  
        marginBottom: '15px',
    },
    text: {
        fontSize: '20px',
        color: 'white',
        lineHeight: '1.6',
    },
};

export default AppFooter;
