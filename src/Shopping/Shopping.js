import React from 'react';
import './Shopping.css';
import { Link } from 'react-router-dom';

function Shopping() {
    return (
        <div className="shopping-container">
            <h1>หน้าร้านค้า</h1>
            <p>เลือกซื้อคอร์สเรียนที่คุณสนใจ</p>
            <Link to="/payment" className="payment-button">ไปที่หน้าชำระเงิน</Link>
            {/* สามารถเพิ่มเนื้อหาของร้านค้าเพิ่มเติมที่นี่ */}
        </div>
    );
}

export default Shopping;