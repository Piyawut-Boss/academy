import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Button, Table, message, Empty, Spin, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Payment.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

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

            console.log('Uploading file:', file);
            const uploadRes = await axios.post('http://localhost:1337/api/upload', formData);
            console.log('Upload response:', uploadRes.data);

            if (!uploadRes.data || uploadRes.data.length === 0) {
                throw new Error('อัปโหลดไฟล์ไม่สำเร็จ');
            }

           
            const fileUploadResponse = uploadRes.data;
            const fileId = fileUploadResponse[0]?.id;

            const user = JSON.parse(localStorage.getItem('user'));
            const userDocumentId = user?.documentId;

            console.log('Cart Courses:', cartCourses);
            console.log('User:', user);
            console.log('User Document ID:', userDocumentId);

            const paymentData = {
                data: {
                    payment_status: 'Pending',
                    payment_proof: fileId,
                    courses: {
                        connect: cartCourses.map(course => course.documentId)
                    },
                    totalAmount: parseFloat(displayedAmount || totalAmount),
                    user: {
                        connect: [userDocumentId]
                    }
                }
            };

            console.log('Full Payment Data:', JSON.stringify(paymentData, null, 2));

            const userToken = localStorage.getItem('jwt');
            const headers = {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            };

            console.log('Making payment request with data:', paymentData);
            const paymentRes = await axios.post('http://localhost:1337/api/payments', paymentData, { headers });
            console.log('Payment response:', paymentRes);

            if (paymentRes.status === 200 || paymentRes.status === 201) {
                message.success('สร้างคำสั่งซื้อสำเร็จ!');
                localStorage.removeItem('cartCourses');
                navigate('/');
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            if (error.response?.data?.error) {
                console.error('Detailed API Error:', error.response.data.error);
                message.error(`เกิดข้อผิดพลาด: ${error.response.data.error.message || error.message}`);
            } else {
                message.error(`เกิดข้อผิดพลาดในการชำระเงิน: ${error.message}`);
            }
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