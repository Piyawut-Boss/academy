import React from 'react';
import './Howto.css';
import fbImage from '../images/facebook.png';
import lineImage from '../images/line.png';
import igImage from '../images/instagram.png';
import ytImage from '../images/youtube.png';
import homepicHowto from '../Howto/img/homepicHowto.png';
import loginpicHowto from '../Howto/img/loginpicHowto.png';
import coursepicHowto from '../Howto/img/coursepicHowto.png';
import paymentpicHowto from '../Howto/img/paymentpicHowto.png';
import inspectionpicHowto from '../Howto/img/inspectionpicHowto.png';
import imgstepHowto from '../Howto/img/imgstepHowto.png';
import tutorImage from '../Howto/img/tutor.png';
import studentpicHowto from '../Howto/img/studentpicHowto.png'; // เพิ่มรูป studentpicHowto

function Howto() {
    const steps = [
        { 
            id: 1, 
            title: 'ขั้นตอนที่ 1 : เข้าสู่ระบบ', 
            desc: 'เข้าเว็บ HAPPY LEARNING ACADEMY เพื่อเข้าสู่คอร์สเรียนของเรา', 
            img: homepicHowto
        },
        { 
            id: 2, 
            title: 'ขั้นตอนที่ 2 : Login', 
            desc: 'เข้าสู่ระบบ (ถ้าเคย Login แล้ว ข้ามได้)', 
            img: loginpicHowto
        },
        { 
            id: 3, 
            title: 'ขั้นตอนที่ 3 : เลือกคอร์สเรียน', 
            desc: 'เลือกคอร์สเรียนที่ต้องการใส่ตะกร้า', 
            img: coursepicHowto
        },
        { 
            id: 4, 
            title: 'ขั้นตอนที่ 4 : ชำระเงิน', 
            desc: (
                <>
                    ระบบแสดงรายการที่เลือก คลิก <b>“ชำระเงิน”</b> 
                    <br />
                    <span className="red-text">* กดใช้โปรโมชั่นในหน้านี้ได้เลย</span>
                    <br />
                    <span className="blue-text">* มีหลายช่องทางให้ชำระเงิน</span>
                </>
            ),
            img: paymentpicHowto
        },
        { 
            id: 5, 
            title: 'ขั้นตอนที่ 5 : รอการตรวจสอบ', 
            desc: (
                <>
                    รอระบบตรวจสอบการชำระเงิน
                    <br />
                    <span className="blue-text">* สามารถเช็คคอร์สได้ที่หน้าคอร์สเรียน</span>
                </>
            ),
            img: inspectionpicHowto
        }
    ];

    return (
        <div className="howto-container">
            {/* ส่วนหัว */}
            <header className="header">
                <h1 className="title">วิธีการสั่งซื้อ</h1>
                <h2 style={{ color: "#FFC900", fontSize: "2rem", fontWeight: "bold",textAlign: "center" }}>HAPPY LEARNING ACADEMY</h2>
                <img src={imgstepHowto} alt="วิธีการสั่งซื้อ" className="header-image" />
            </header>

            {/* ส่วนขั้นตอน */}
            <div className="timeline"></div>
            <div className="steps">
                {steps.map(step => (
                    <Step key={step.id} step={step} />
                ))}
            </div>

            {/* เพิ่มรูป studentpicHowto ใต้ขั้นตอนที่ 5 */}
            <div className="student-image-container">
                <img src={studentpicHowto} alt="Student" className="student-image" />
            </div>

            {/* ช่องทางการติดตาม */}
            <div className="contact">
                <h3 className="contact-title">ช่องทางการติดตาม</h3>
                <div className="contact-links">
                    <a href="https://facebook.com" className="contact-link">
                        <img src={fbImage} alt="Facebook" />
                    </a>
                    <a href="https://line.me" className="contact-link">
                        <img src={lineImage} alt="Line" />
                    </a>
                    <a href="https://instagram.com" className="contact-link">
                        <img src={igImage} alt="Instagram" />
                    </a>
                    <a href="https://youtube.com" className="contact-link">
                        <img src={ytImage} alt="YouTube" />
                    </a>
                </div>
            </div>
        </div>
    );
}

// Component สำหรับแสดงแต่ละขั้นตอน
function Step({ step }) {
    return (
        <div className="step">
            <div className="step-number">{step.id}</div>
            <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
            </div>
            <img src={step.img} alt={step.title} className="step-image" />
        </div>
    );
}

export default Howto;