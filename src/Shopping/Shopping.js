import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Empty, Input, message } from 'antd';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, Trash2 } from 'lucide-react';
import axios from 'axios';
import './Shopping.css';

function Shopping() {
    const [cartCourses, setCartCourses] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [validPromo, setValidPromo] = useState(null);
    const [discount, setDiscount] = useState(0);

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

    const applyPromoCode = async () => {
        try {
            const response = await axios.get('http://localhost:1337/api/promotions?populate=*');
            const promotions = response.data.data;
            const foundPromo = promotions.find(promo => promo.CodeName === promoCode);

            if (!foundPromo) {
                message.error('โค้ดไม่ถูกต้อง');
                setValidPromo(null);
                setDiscount(0);
                return;
            }

            const applicableCourses = cartCourses.filter(course =>
                course.categories.some(cat => foundPromo.categories.some(promoCat => promoCat.id === cat.id))
            );

            if (applicableCourses.length === 0) {
                message.error('โค้ดนี้ไม่สามารถใช้กับคอร์สที่คุณเลือกได้');
                setValidPromo(null);
                setDiscount(0);
                return;
            }

            setValidPromo(foundPromo);
            setDiscount(foundPromo.Discount);
            message.success(`ใช้โค้ด ${promoCode} ได้สำเร็จ! ลด ${foundPromo.Discount}%`);
        } catch (error) {
            console.error('Error fetching promotions:', error);
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

    const totalAmount = cartCourses.reduce((sum, course) => sum + (course.realprice || 0), 0);
    const discountedAmount = validPromo ? totalAmount * (1 - discount / 100) : totalAmount;

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

            <motion.div className="cart-section" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
                {cartCourses.length > 0 ? (
                    <>
                        <Table dataSource={cartCourses} columns={columns} rowKey="id" className="modern-table" pagination={false} />
                        <div className="promo-section">
                            <Input
                                placeholder="กรอกรหัสโปรโมชัน"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="promo-input"
                            />
                            <Button type="primary" onClick={applyPromoCode}>
                                ใช้โค้ด
                            </Button>
                        </div>
                        <div className="cart-summary">
                            <div className="total-amount">
                                ยอดรวมทั้งหมด: {totalAmount.toLocaleString()} บาท
                            </div>
                            {validPromo && (
                                <div className="discounted-amount">
                                    ราคาหลังหักส่วนลด: {discountedAmount.toLocaleString()} บาท
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="empty-cart">
                        <Empty description="ยังไม่มีคอร์สในตะกร้าของคุณ" image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
