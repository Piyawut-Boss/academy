import React from 'react';
import happyLearningLogo from './happy-learning-logo.png'; // นำเข้าภาพโลโก้
import { MdLabelImportant } from 'react-icons/md';

function Footer() {
    const footerStyle = {
        position: 'relative' ,  // ใช้ fixed เพื่อติดล่างสุดของหน้าจอ
        width: '100%',
        height: '250px', // กำหนดความสูง
        backgroundColor: '#777777', // สีพื้นหลัง
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // จัดตำแหน่งซ้าย-ขวา
        padding: '0 20px', // เพิ่มระยะห่างด้านซ้ายและขวา
        bottom: 0, // ติดล่างสุด
        left: 0,
        zIndex: 1000, // เพื่อให้ Footer อยู่ด้านบนสุด
    };

    const logoContainerStyle = {
        display: 'flex',
        alignItems: 'center', // จัดตำแหน่งแนวตั้งของภาพให้อยู่ตรงกลาง
        justifyContent: 'center', // จัดตำแหน่งแนวนอนของภาพให้อยู่ตรงกลาง
        height: '100%', // ครอบคลุมความสูงของ footer
    };

    const logoStyle = {
        height: '100px', // กำหนดความสูงของภาพ
        width: 'auto',   // ให้ภาพปรับตามอัตราส่วน
    };

    return (
        <footer style={footerStyle}>
            <div style={logoContainerStyle}>
                <img src={happyLearningLogo} alt="Happy Learning Logo" style={logoStyle} />
            </div>
            <div>
                {/* พื้นที่ด้านขวาสำหรับข้อความหรือคอนเทนต์เพิ่มเติม */}
            </div>
        </footer>
    );
}

export default Footer;
