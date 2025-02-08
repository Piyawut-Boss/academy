import React from 'react';
import './Payment.css';
import { Link } from 'react-router-dom';

function Payment() {
    return (
        <div className="payment-container">
            <h1>หน้าชำระเงิน</h1>
            <p>กรุณาเลือกวิธีการชำระเงินของคุณ</p>
            <Link to="/shopping" className="back-button">กลับไปที่ร้านค้า</Link>
        </div>
    );
}

export default Payment;