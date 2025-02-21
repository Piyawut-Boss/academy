import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Empty, Input, message, Select } from 'antd';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, Trash2 } from 'lucide-react';
import axios from 'axios';
import './Shopping.css';


const { Option } = Select;

function Shopping() {
  const [cartCourses, setCartCourses] = useState([]); // สถานะเก็บคอร์สที่อยู่ในตะกร้า
  const [orderHistory, setOrderHistory] = useState([]); // สถานะเก็บประวัติการสั่งซื้อ
  const [promoCode, setPromoCode] = useState(''); // สถานะเก็บรหัสโปรโมชัน
  const [validPromo, setValidPromo] = useState(null); // สถานะเก็บการตรวจสอบโปรโมชัน
  const [discountedAmount, setDiscountedAmount] = useState(0); // สถานะเก็บจำนวนเงินที่ลดหลังจากโปรโมชัน
  const [selectedStatus, setSelectedStatus] = useState('All'); // สถานะเก็บการเลือกสถานะของคำสั่งซื้อ

  // ดึงข้อมูลตะกร้าและประวัติการสั่งซื้อจาก localStorage และ API
  useEffect(() => {
    const storedCartCourses = localStorage.getItem('cartCourses');
    if (storedCartCourses) {
      setCartCourses(JSON.parse(storedCartCourses));
    }

    const storedDiscountedAmount = localStorage.getItem('discountedAmount');
    if (storedDiscountedAmount) {
      setDiscountedAmount(parseFloat(storedDiscountedAmount));
    }

    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/payments?1=1&populate=*');
        setOrderHistory(response.data.data); // เก็บประวัติการสั่งซื้อใน state
      } catch (error) {
        console.error('Error fetching order history:', error); // แสดงข้อผิดพลาดหากไม่สามารถดึงข้อมูลได้
      }
    };

    fetchOrderHistory();
  }, []);

  // ฟังก์ชันลบคอร์สจากตะกร้า
  const removeFromCart = (courseId) => {
    const updatedCartCourses = cartCourses.filter(course => course.id !== courseId); // ลบคอร์สที่เลือกจากตะกร้า
    setCartCourses(updatedCartCourses);
    localStorage.setItem('cartCourses', JSON.stringify(updatedCartCourses)); // บันทึกตะกร้าใหม่ลง localStorage
  };

  // ฟังก์ชันในการใช้รหัสโปรโมชัน
  const applyPromoCode = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/promotions?populate=*');
      const promotions = response.data.data;
      const foundPromo = promotions.find(promo => promo.CodeName === promoCode); // ค้นหาข้อมูลโปรโมชันที่ตรงกับรหัสที่กรอก

      if (!foundPromo) {
        message.error('โค้ดไม่ถูกต้อง'); // แสดงข้อความหากรหัสโปรโมชันไม่ถูกต้อง
        setValidPromo(null);
        setDiscountedAmount(0);
        return;
      }

      // คัดกรองคอร์สที่สามารถใช้โปรโมชันได้
      const applicableCourses = cartCourses.filter(course =>
        course.categories.some(cat => foundPromo.categories.some(promoCat => promoCat.id === cat.id))
      );

      if (applicableCourses.length === 0) {
        message.error('โค้ดนี้ไม่สามารถใช้กับคอร์สที่คุณเลือกได้'); // แสดงข้อความหากไม่สามารถใช้โปรโมชันได้
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

      message.success(`ใช้โค้ด ${promoCode} ได้สำเร็จ! ลด ${foundPromo.Discount}%`); // แสดงข้อความเมื่อโปรโมชันถูกใช้สำเร็จ
    } catch (error) {
      console.error('Error fetching promotions:', error); // แสดงข้อผิดพลาดเมื่อไม่สามารถดึงข้อมูลโปรโมชัน
    }
  };

  // คอลัมน์ที่ใช้ในการแสดงตารางคอร์สในตะกร้า
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
          onClick={() => removeFromCart(record.id)} // ลบคอร์สที่เลือก
          className="delete-button"
        >
          ลบรายการ
        </Button>
      ),
    },
  ];

  // คอลัมน์ที่ใช้ในการแสดงประวัติการสั่งซื้อ
  const orderColumns = [
    {
      title: 'วันที่สั่งซื้อ',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => new Date(createdAt).toLocaleString(), // แสดงวันที่และเวลาในรูปแบบที่อ่านง่าย
    },
    {
      title: 'คอร์สที่ซื้อ',
      dataIndex: 'courses',
      key: 'courses',
      render: (courses) =>
        courses?.length > 0
          ? courses.map(course => course.attributes?.Title || 'ไม่มีชื่อ').join(', ')
          : 'ไม่มีข้อมูล', // แสดงชื่อคอร์สที่ซื้อ
    },
    {
      title: 'สถานะการชำระเงิน',
      dataIndex: 'payment_status',
      key: 'payment_status',
    },
  ];

  // กรองประวัติการสั่งซื้อตามสถานะที่เลือก
  const filteredOrderHistory = selectedStatus === 'All' ? orderHistory : orderHistory.filter(order => order.payment_status === selectedStatus);

  // คำนวณยอดรวมก่อนและหลังจากใช้โปรโมชัน
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
                onChange={(e) => setPromoCode(e.target.value)} // เมื่อกรอกรหัสโปรโมชัน
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

  {/* ตัวกรองสถานะคำสั่งซื้อ */}
  <Select
    value={selectedStatus}
    onChange={setSelectedStatus} // เมื่อเลือกสถานะใหม่
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
