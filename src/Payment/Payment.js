import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Button, Table, message, Empty, Spin, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Payment.css';

function Payment() {
    const [cartCourses, setCartCourses] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCartCourses = localStorage.getItem('cartCourses');
        if (storedCartCourses) {
            setCartCourses(JSON.parse(storedCartCourses));
        }
    }, []);

    const totalAmount = cartCourses.reduce((sum, course) => sum + (course.realprice || 0), 0); // ราคาหลังหักส่วนลด
    const displayedAmount = localStorage.getItem('displayedAmount'); // ราคาหลังหักส่วนลดที่เก็บใน localStorage

    const handleUpload = ({ file }) => {
        setFile(file);
    };

    const handleSubmit = async () => {
        if (!file) {
            message.error('กรุณาอัปโหลดสลิปการโอนเงิน');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('files', file);

            const uploadRes = await axios.post('http://localhost:1337/api/upload', formData);
            if (!uploadRes.data || uploadRes.data.length === 0) {
                throw new Error('อัปโหลดไฟล์ไม่สำเร็จ');
            }

            const fileUrl = uploadRes.data[0]?.url;
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id || 1;

            const paymentData = {
                data: {
                    documentId: Math.random().toString(36).substr(2, 10),
                    payment_status: 'Pending',
                    payment_proof: fileUrl,
                    courses: cartCourses.map(course => course.id),
                    totalAmount: displayedAmount || totalAmount, // ใช้ displayedAmount ถ้ามี ถ้าไม่มีให้ใช้ totalAmount
                    user: userId,
                }
            };

            const paymentRes = await axios.post('http://localhost:1337/api/payments', paymentData);
            if (paymentRes.status === 200 || paymentRes.status === 201) {
                message.success('สร้างคำสั่งซื้อสำเร็จ!');
                localStorage.removeItem('cartCourses');
                navigate('/');
            } else {
                throw new Error('การสร้างคำสั่งซื้อผิดพลาด');
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            message.error('เกิดข้อผิดพลาดในการชำระเงิน');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'ภาพตัวอย่าง',
            dataIndex: 'Promotepic',
            key: 'Promotepic',
            render: (Promotepic) => (
                Promotepic && Promotepic.url ? (
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={`http://localhost:1337${Promotepic.url}`}
                        alt='Preview'
                        className='course-image'
                        style={{ width: 80, height: 50, objectFit: 'cover' }}
                    />
                ) : (
                    <Empty description='ไม่มีภาพ' />
                )
            ),
        },
        {
            title: 'ชื่อคอร์ส',
            dataIndex: 'Title',
            key: 'Title'
        },
        {
            title: 'ราคาเต็ม',
            dataIndex: 'Price',
            key: 'Price',
            render: text => text ? `${text.toLocaleString()} บาท` : 'N/A'
        },
        {
            title: 'ราคาหลังลด',
            dataIndex: 'realprice',
            key: 'realprice',
            render: text => text ? `${text.toLocaleString()} บาท` : 'N/A'
        }

    ];

    return (
        <>
            <div className='payment-container'>
                <h1>หน้าชำระเงิน</h1>
                <p>กรุณาโอนเงินไปที่บัญชี:</p>
                <div className='bank-details'>
                    <p>ชื่อบัญชี: บริษัท Happu Learning Academy จำกัด</p>
                    <p>ธนาคารไทยพาณิชย์</p>
                    <p>เลขบัญชี: 123-456-7890</p>
                    <img src={require('./qr-code.png')} alt='QR Code' className='qr-code' />
                </div>

                <h2>สรุปคำสั่งซื้อ</h2>
                {cartCourses.length === 0 ? (
                    <Alert message="ไม่มีคอร์สในตะกร้า กรุณาเลือกคอร์สก่อนทำการชำระเงิน" type="warning" showIcon />
                ) : (
                    <Table dataSource={cartCourses} columns={columns} rowKey='id' pagination={false} />
                )}

                <div className="payment-actions">
                    <Link to='/shopping' className='back-button'>แก้ไขคำสั่งซื้อ</Link>

                    <h3 className="total-amount">
                        ยอดรวมที่ต้องจ่าย: {displayedAmount ? parseFloat(displayedAmount).toLocaleString() : totalAmount.toLocaleString()} บาท
                    </h3>

                    <Upload beforeUpload={() => false} onChange={handleUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined />} className="upload-slip">อัปโหลดสลิปการโอนเงิน</Button>
                    </Upload>

                    {file && <p className="file-name">ไฟล์ที่เลือก: {file.name}</p>}

                    <Button
                        type='primary'
                        onClick={handleSubmit}
                        className="confirm-button"
                        disabled={loading || cartCourses.length === 0}
                    >
                        {loading ? <Spin /> : 'ยืนยันการชำระเงิน'}
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Payment;