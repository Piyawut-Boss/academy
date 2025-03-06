import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Empty, Input, message, Select } from 'antd';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, Trash2 } from 'lucide-react';
import axios from 'axios';
import './Shopping.css';

const { Option } = Select;
const API_BASE = process.env.REACT_APP_API_BASE_URL;


function Shopping() {
  const [cartCourses, setCartCourses] = useState(() => {
    const storedCartCourses = localStorage.getItem('cartCourses');
    return storedCartCourses ? JSON.parse(storedCartCourses) : [];
  });

  const [orderHistory, setOrderHistory] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [validPromo, setValidPromo] = useState(null);
  const [discountedAmount, setDiscountedAmount] = useState(() => {
    const storedDiscountedAmount = localStorage.getItem('discountedAmount');
    return storedDiscountedAmount ? parseFloat(storedDiscountedAmount) : 0;
  });
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/payments?1=1&populate=*`);
        setOrderHistory(response.data.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderHistory();
  }, []);

  const removeFromCart = (courseId) => {
    const updatedCartCourses = cartCourses.filter(course => course.id !== courseId);
    setCartCourses(updatedCartCourses);
    localStorage.setItem('cartCourses', JSON.stringify(updatedCartCourses));
  };

  const applyPromoCode = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/promotions?populate=*`);
      const promotions = response.data.data;
      const foundPromo = promotions.find(promo => promo.CodeName === promoCode);

      if (!foundPromo) {
        message.error('โค้ดไม่ถูกต้อง');
        setValidPromo(null);
        setDiscountedAmount(0);
        return;
      }

      const applicableCourses = cartCourses.filter(course =>
        course.categories?.some(cat => foundPromo.categories?.some(promoCat => promoCat.id === cat.id))
      );

      if (applicableCourses.length === 0) {
        message.error('โค้ดนี้ไม่สามารถใช้กับคอร์สที่คุณเลือกได้');
        setValidPromo(null);
        setDiscountedAmount(0);
        return;
      }

      setValidPromo(foundPromo);
      const realTotal = cartCourses.reduce((sum, course) => sum + (course.realprice || 0), 0);
      const newDiscountedAmount = realTotal * (1 - foundPromo.Discount / 100);
      setDiscountedAmount(newDiscountedAmount);

      const displayedAmount = Math.round(foundPromo ? newDiscountedAmount : realTotal);
      localStorage.setItem('displayedAmount', displayedAmount.toString());

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
      render: (Promotepic) => {
        console.log(Promotepic.url); 
        return Promotepic && Promotepic.url ? (
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={`${API_BASE}${Promotepic.url}`}
            alt="Preview"
            className="course-image"
          />
        ) : (
          <img
            src="https://via.placeholder.com/150"
            alt="default"
            className="course-image"
          />
        );
      }
    },
    {
      title: 'ชื่อคอร์ส',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: 'ราคาเต็ม',
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

  const orderColumns = [
    {
      title: 'วันที่สั่งซื้อ',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: 'คอร์สที่ซื้อ',
      dataIndex: 'courses',
      key: 'courses',
      render: (courses) => courses.map(course => course.Title).join(', '),
    },
    {
      title: 'สถานะการชำระเงิน',
      dataIndex: 'payment_status',
      key: 'payment_status',
    },
  ];

  const filteredOrderHistory = useMemo(() => {
    return selectedStatus === 'All' ? orderHistory : orderHistory.filter(order => order.payment_status === selectedStatus);
  }, [selectedStatus, orderHistory]);

  const realTotal = cartCourses.reduce((sum, course) => sum + (course.realprice || 0), 0);
  const totalAmount = cartCourses.reduce((sum, course) => sum + (course.Price || 0), 0);
  const displayedAmount = Math.round(validPromo ? discountedAmount : realTotal);

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
              <Button onClick={applyPromoCode} type="primary" className="apply-button">
                ใช้โปรโมชัน
              </Button>
            </div>
            <div className="total">
              <h3>ยอดรวม: {totalAmount.toLocaleString()} บาท</h3>
              <div className="final-price">
                <h4>ราคาหลังหักส่วนลด: {displayedAmount.toLocaleString()} บาท</h4>
              </div>
            </div>
          </>
        ) : (
          <Empty description="ตะกร้าของคุณว่างเปล่า" />
        )}
      </motion.div>

      <motion.div className="order-history-section" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
        <h2>ประวัติการสั่งซื้อ</h2>
        <Select
          value={selectedStatus}
          onChange={setSelectedStatus}
          style={{ width: 200, marginBottom: '20px', marginTop: '20px' }}
          className={selectedStatus !== 'All' ? 'selected-status' : ''}
        >
          <Option value="All">All</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>
        <Table dataSource={filteredOrderHistory} columns={orderColumns} rowKey="id" className="modern-table" pagination={false} />
      </motion.div>
    </motion.div>
  );
}

export default Shopping;