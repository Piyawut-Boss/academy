import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Button, Table, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Payment.css';
import { motion } from "framer-motion"; // เพิ่ม import motion
import { Empty } from "antd"; // เพิ่ม import Empty


function Payment() {
    const [cartCourses, setCartCourses] = useState([]);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const storedCartCourses = localStorage.getItem('cartCourses');
        if (storedCartCourses) {
            setCartCourses(JSON.parse(storedCartCourses));
        }
    }, []);

    const totalAmount = cartCourses.reduce((sum, course) => sum + (course.realprice || 0), 0);

    const handleUpload = ({ file }) => {
        setFile(file);
    };

    const handleSubmit = async () => {
        if (!file) {
            message.error('กรุณาอัปโหลดสลิปการโอนเงิน');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('files', file);
            
            const uploadRes = await axios.post('http://localhost:1337/api/upload', formData);
            const fileUrl = uploadRes.data[0].url;
            
            const paymentData = {
                data: {
                    documentId: Math.random().toString(36).substr(2, 10),
                    payment_status: 'Pending',
                    payment_proof: fileUrl,
                    courses: cartCourses.map(course => course.id),
                    totalAmount: totalAmount,
                    user: 1, // เปลี่ยนเป็น user id ของระบบจริง
                }
            };
            
            await axios.post('http://localhost:1337/api/payments', paymentData);
            message.success('สร้างคำสั่งซื้อสำเร็จ!');
            localStorage.removeItem('cartCourses');
            navigate('/');
        } catch (error) {
            console.error('Error creating payment:', error);
            message.error('เกิดข้อผิดพลาดในการชำระเงิน');
        }
    };

    const columns = [
        { 
            title: 'ภาพตัวอย่าง',
            dataIndex: 'Promotepic',
            key: 'Promotepic',
            render: (Promotepic) => (
                Promotepic ? (
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={`http://localhost:1337${Promotepic.url}`}
                        alt="Preview"
                        className="course-image"
                        style={{ width: 80, height: 50, objectFit: 'cover' }}
                    />
                ) : (
                    <Empty description="ไม่มีภาพ" />
                )
            ),
        },
        { title: 'ชื่อคอร์ส', dataIndex: 'Title', key: 'Title' },
        { 
            title: 'ราคาหลังลด', 
            dataIndex: 'realprice', 
            key: 'realprice', 
            render: text => text ? `${text.toLocaleString()} บาท` : 'N/A' 
        },
    ];
    

    return (
        <div className="payment-container">
            <h1>หน้าชำระเงิน</h1>
            <p>กรุณาโอนเงินไปที่บัญชี:</p>
            <div className="bank-details">
                <p>ชื่อบัญชี: บริษัท ABC จำกัด</p>
                <p>เลขบัญชี: 123-456-7890</p>
                <img src="/qr-code-placeholder.png" alt="QR Code" className="qr-code" />
            </div>
            <h2>สรุปคำสั่งซื้อ</h2>
            <Table dataSource={cartCourses} columns={columns} rowKey="id" pagination={false} />
            <h3>ยอดรวมที่ต้องจ่าย: {totalAmount.toLocaleString()} บาท</h3>
            <Upload beforeUpload={() => false} onChange={handleUpload} showUploadList={false}>
                <Button icon={<UploadOutlined />}>อัปโหลดสลิปการโอนเงิน</Button>
            </Upload>
            {file && <p>ไฟล์ที่เลือก: {file.name}</p>}
            <Button type="primary" onClick={handleSubmit} style={{ marginTop: 20 }}>ยืนยันการชำระเงิน</Button>
            <Link to="/shopping" className="back-button">กลับไปที่ร้านค้า</Link>
        </div>
    );
}

export default Payment;
