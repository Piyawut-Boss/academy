import React, { useState, useEffect } from 'react';
import './Shopping.css';
import { Link } from 'react-router-dom';
import { Table, Button } from 'antd';

function Shopping() {
    const [cartCourses, setCartCourses] = useState([]);

    useEffect(() => {
        const storedCartCourses = localStorage.getItem('cartCourses');
        if (storedCartCourses) {
            setCartCourses(JSON.parse(storedCartCourses));
        }
    }, []);

    const removeFromCart = (courseId) => {
        const updatedCartCourses = cartCourses.filter(course => course.id !== courseId);
        setCartCourses(updatedCartCourses);
        localStorage.setItem('cartCourses', JSON.stringify(updatedCartCourses));
    };

    const columns = [
        {
            title: 'ภาพตัวอย่าง',
            dataIndex: 'Promotepic',
            key: 'Promotepic',
            render: (Promotepic) => (
                Promotepic ? <img src={`http://localhost:1337${Promotepic.url}`} alt="Preview" style={{ width: '100px' }} /> : 'ไม่มีภาพ'
            ),
        },
        {
            title: 'ชื่อคอร์ส',
            dataIndex: 'Title',
            key: 'Title',
        },
        {
            title: 'รายละเอียด',
            dataIndex: 'Description',
            key: 'Description',
        },
        {
            title: 'ราคา',
            dataIndex: 'Price',
            key: 'Price',
            render: (text) => text ? `${text.toLocaleString()} บาท` : 'N/A',
        },
        {
            title: 'ราคาหลังลด',
            dataIndex: 'realprice',
            key: 'realprice',
            render: (text) => text ? `${text.toLocaleString()} บาท` : 'N/A',
        },
        {
            title: '',
            key: 'action',
            render: (text, record) => (
                <Button type="danger" onClick={() => removeFromCart(record.id)}>ลบออกจากตะกร้า</Button>
            ),
        },
    ];

    return (
        <div className="shopping-container">
            <h1>หน้าร้านค้า</h1>
            <p>เลือกซื้อคอร์สเรียนที่คุณสนใจ</p>
            <Link to="/payment" className="payment-button">ไปที่หน้าชำระเงิน</Link>
            {/* สามารถเพิ่มเนื้อหาของร้านค้าเพิ่มเติมที่นี่ */}
            <div className="cart-section">
                <h2>คอร์สในตะกร้าของคุณ</h2>
                {cartCourses.length > 0 ? (
                    <Table dataSource={cartCourses} columns={columns} rowKey="id" />
                ) : (
                    <p>ยังไม่มีคอร์สในตะกร้าของคุณ</p>
                )}
            </div>
        </div>
    );
}

export default Shopping;