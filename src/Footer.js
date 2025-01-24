import React from 'react';
import happyLearningLogo from './happy-learning-logo.png'; // นำเข้าภาพโลโก้

function Footer() {
    const footerStyle = {
        position: 'absolute',
        width: '100%',
        height: '250px', // กำหนดความสูง
        backgroundColor: '#777777', // สีพื้นหลัง
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // จัดตำแหน่งซ้าย-ขวา
        padding: '0 20px', // เพิ่มระยะห่างด้านซ้ายและขวา
        bottom: 0,
        left: 0,
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
