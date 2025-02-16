import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Empty } from 'antd';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, Trash2 } from 'lucide-react';
import './Shopping.css';


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
                Promotepic ? (
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={`http://localhost:1337${Promotepic.url}`}
                        alt="Preview"
                        className="course-image"
                    />
                ) : (
                    <Empty description="ไม่มีภาพ" />
                )
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
                <Button 
                    type="text" 
                    danger 
                    icon={<Trash2 size={18} />}
                    onClick={() => removeFromCart(record.id)}
                    className="delete-button"
                >
                    ลบรายการ
                </Button>
            ),
        },
    ];

    return (
        <motion.div 
            className="shopping-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="shopping-header">
                <div className="header-content">
                    <h1><ShoppingCart className="icon" /> ตะกร้าสินค้า</h1>
                    <Link to="/payment" className="payment-button">
                        <CreditCard className="icon" /> ชำระเงิน
                    </Link>
                </div>
            </div>

            <motion.div 
                className="cart-section"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {cartCourses.length > 0 ? (
                    <>
                        <Table 
                            dataSource={cartCourses} 
                            columns={columns} 
                            rowKey="id"
                            className="modern-table"
                            pagination={false}
                        />
                        <div className="cart-summary">
                            <div className="total-amount">
                                ยอดรวมทั้งหมด: {cartCourses.reduce((sum, course) => sum + (course.realprice || 0), 0).toLocaleString()} บาท
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-cart">
                        <Empty 
                            description="ยังไม่มีคอร์สในตะกร้าของคุณ" 
                            image={Empty.PRESENTED_IMAGE_SIMPLE} 
                        />
                        <Link to="/course" className="browse-courses-button">
                            เลือกดูคอร์สเรียน
                        </Link>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

export default Shopping;