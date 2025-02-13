// Howto.js
import React from 'react';
import Step from './Step';
import './Howto.css';
import fbImage from './images/facebook.png';
import lineImage from './images/line.png';
import igImage from './images/instagram.png';
import ytImage from './images/youtube.png';
import mainImage from './images/main.png';
import logImage from './images/log.png';
import coursePageImage from './images/course page 1.png';
import payment1Image from './images/payment 1.png';
import payment2Image from './images/payment 2.png';
import group146Image from './images/Group 146.png';
import tutorImage from './images/tutor.png';

function Howto() {
    // ข้อมูลขั้นตอนทั้งหมด
    const steps = [
        { id: 1, img: mainImage, title: 'ขั้นตอนที่ 1 : เข้าสู่ระบบ', desc: 'เข้าสู่เว็บไซต์ HAPPY LEARNING ACADEMY เพื่อเข้าสู่คอร์สเรียนของเรา' },
        { id: 2, img: logImage, title: 'ขั้นตอนที่ 2 : Login', desc: 'Login เข้าสู่ระบบ (หาก login เรียบร้อยแล้วสามารถข้ามขั้นตอนนี้ไปได้)' },
        { id: 3, img: coursePageImage, title: 'ขั้นตอนที่ 3 : เลือกคอร์สเรียน', desc: 'เลือกคอร์สเรียนที่ต้องการใส่ตะกร้า' },
        { 
            id: 4, 
            img: payment1Image, 
            title: 'ขั้นตอนที่ 4 : ชำระเงิน', 
            desc: (
                <>
                    ระบบจะแสดงรายการในหน้าตะกร้าสินค้า คลิกปุ่ม <b>“ชำระเงิน”</b> เพื่อทำการสมัครคอร์สเรียนได้เลย
                    <br />
                    <span className="red-text">* สามารถกดใช้โปรโมชั่นในหน้านี้ได้เลย</span>
                    <br />
                    <span className="blue-text">* คอร์สเรียนของเรามีช่องทางการชำระเงินหลายช่องทางให้เลือกเลย</span>
                </>
            )
        },
        { 
            id: 5, 
            img: payment2Image, 
            title: 'ขั้นตอนที่ 5 : รอการตรวจสอบ', 
            desc: (
                <>
                    รอการตรวจสอบจากระบบเมื่อชำระเงินเรียบร้อย จะสามารถเข้าสู่คอร์สเรียนที่ซื้อได้
                    <br />
                    <span className="blue-text">* สามารถเช็คคอร์สเรียนได้ที่หน้าคอร์สเรียนหรือหน้าโปรไฟล์ของฉัน</span>
                </>
            )
        }
    ];

    return (
        <div className="howto-container">
            {/* ส่วนหัว */}
            <header className="header">
                <h1 className="title" style={{ fontSize: '5rem', color: '#473E91' }}>วิธีการสั่งซื้อ</h1>
                <h2 style={{ fontSize: '2rem', color: '#FFC900', marginTop: '0.5rem' }}>HAPPY LEARNING ACADEMY</h2>
                <img src={group146Image} alt="วิธีการสั่งซื้อ" className="header-image" />
            </header>
            
            {/* ส่วนขั้นตอน */}
            <div className="timeline"></div>
            <div className="steps">
                {steps.map(step => (
                    <Step key={step.id} step={step} />
                ))}
            </div>
            
            {/* ส่วนท้าย */}
            <div className="highlight-box">
                <img src={tutorImage} alt="Happy Tutor" className="tutor-image" />
            </div>
            
            {/* ช่องทางการติดต่อ */}
            <div className="contact">
                <h3>ช่องทางการติดต่อ</h3>
                <div className="contact-links">
                    <a href="https://facebook.com" className="contact-link">
                        <img src={fbImage} />
                    </a>
                    <a href="https://line.me" className="contact-link">
                        <img src={lineImage} />
                    </a>
                    <a href="https://instagram.com" className="contact-link">
                        <img src={igImage} />
                    </a>
                    <a href="https://youtube.com" className="contact-link">
                        <img src={ytImage} />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Howto;
