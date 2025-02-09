import React, { useState, useEffect } from 'react';
import './Shopping.css';
import { Link } from 'react-router-dom';

function Shopping() {
    const [cartCourses, setCartCourses] = useState([]);

    useEffect(() => {
        const storedCartCourses = localStorage.getItem('cartCourses');
        if (storedCartCourses) {
            setCartCourses(JSON.parse(storedCartCourses));
        }
    }, []);

    return (
        <div className="shopping-container">
            <h1>หน้าร้านค้า</h1>
            <p>เลือกซื้อคอร์สเรียนที่คุณสนใจ</p>
            <Link to="/payment" className="payment-button">ไปที่หน้าชำระเงิน</Link>
            {/* สามารถเพิ่มเนื้อหาของร้านค้าเพิ่มเติมที่นี่ */}
            <div className="cart-section">
                <h2>คอร์สในตะกร้าของคุณ</h2>
                {cartCourses.length > 0 ? (
                    <ul>
                        {cartCourses.map((course, index) => (
                            <li key={index}>{course.Title}</li>
                        ))}
                    </ul>
                ) : (
                    <p>ยังไม่มีคอร์สในตะกร้าของคุณ</p>
                )}
            </div>
        </div>
    );
}

export default Shopping;