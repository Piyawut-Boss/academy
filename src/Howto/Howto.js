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
import tutorpicHowto from '../Howto/img/tutorpicHowto.png';
import studentpicHowto from '../Howto/img/studentpicHowto.png';

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
        },
        {
            id: 6,
            title: '5 Step ง่ายๆ ใครก็ทำได้',  // เพิ่มหัวข้อที่นี่
            desc: (
                <>
                    <span className="blue-text">แล้วมาเป็นส่วนหนึ่งของสถาบันเรากันนะ</span>
                </>
            ),
            img: studentpicHowto
        }
    ];

    return (
        <div className="howto-container">
            {/* ส่วนหัว */}
            <header className="header">
                <h1 className="title">วิธีการสั่งซื้อ</h1>
                <h2 style={{ color: "#FFC900", fontSize: "2rem", fontWeight: "bold" }}>
                    HAPPY LEARNING ACADEMY
                </h2>
                <img src={imgstepHowto} alt="วิธีการสั่งซื้อ" className="header-image" />
            </header>

            {/* ส่วนขั้นตอน */}
            <div className="timeline"></div>
            <div className="steps">
                {steps.map(step => (
                    <Step key={step.id} step={step} />
                ))}
            </div>
            
            {/* เพิ่มรูป tutorImage ใต้ขั้นตอนที่ 5 */}
            <div className="tutorf-imagef-container">
                <img src={tutorpicHowto} alt="Tutor" className="tutorf-imagef" />
            </div>

            {/* ช่องทางการติดตาม */}
            <div style={{ textAlign: "center" }}>
                <h4 className="contact-title">ช่องทางการติดต่อ</h4>

                <div className="contact-container">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src={fbImage} alt="Facebook" className="contact-image" />
                    </a>
                    <a href="https://line.me" target="_blank" rel="noopener noreferrer">
                        <img src={lineImage} alt="LINE" className="contact-image" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src={igImage} alt="Instagram" className="contact-image" />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <img src={ytImage} alt="YouTube" className="contact-image" />
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
            {/* เอาหมายเลขออกเฉพาะในขั้นตอนที่ 6 */}
            {step.id !== 6 && <div className="step-number">{step.id}</div>}
            
            <div className="step-content">
                {/* หุ้มเฉพาะชื่อขั้นตอนในบล็อกสีเหลือง */}
                <h3 className="step-title" style={{
                    backgroundColor: step.id <= 5 ? '#FFC900' : '#FFD700', // สีเหลืองทองสำหรับขั้นตอนที่ 6
                    padding: '10px', // ใส่ padding ให้นิดหน่อย
                    borderRadius: '12px', // ทำมุมโค้ง
                    marginBottom: '15px' // ให้มีระยะห่างระหว่างชื่อขั้นตอนและเนื้อหา
                }}>
                    {step.title}
                </h3>
                <p className="step-desc" style={{ color: step.id === 6 ? 'Blue' : 'black' }}>
                    {step.desc}
                </p>
            </div>

            {/* สำหรับขั้นตอนที่ 6 ก็ยังคงให้แสดงภาพ */}
            {step.img && <img src={step.img} alt={step.title} className="step-image" />}
        </div>
    );
}

export default Howto;
