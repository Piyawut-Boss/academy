import React, { createContext, useContext, useState } from 'react';

// สร้าง Context สำหรับการจัดการ HeaderPromote
const HeaderPromoteContext = createContext();

// Custom hook เพื่อใช้งาน Context
export function useHeaderPromote() {
  return useContext(HeaderPromoteContext);
}

// Component Provider สำหรับจัดการสถานะ HeaderPromote
export function HeaderPromoteProvider({ children }) {
  const [isPromoteVisible, setPromoteVisible] = useState(true);

  const closePromote = () => {
    setPromoteVisible(false); // ปิด HeaderPromote
  };

  return (
    <HeaderPromoteContext.Provider value={{ isPromoteVisible, closePromote }}>
      {children}
    </HeaderPromoteContext.Provider>
  );
}

// Component HeaderPromote
function HeaderPromote() {
  const { isPromoteVisible, closePromote } = useHeaderPromote(); // ดึงข้อมูลจาก Context

  if (!isPromoteVisible) return null; // ถ้าไม่ให้แสดง HeaderPromote ให้ return null

  const promoteStyle = {
    backgroundColor: '#DD0C0C', // สีพื้นหลัง
    color: '#333', // สีข้อความ
    textAlign: 'center',
    padding: '10px 20px',
    position: 'relative',
    marginBottom: '10px', // เพิ่มระยะห่างจากด้านล่าง
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '50%',
    right: '20px',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  };

  return (
    <div style={promoteStyle}>
      <span>คอร์สพิเศษ!!! A-Level เข้ามหาลัย พร้อมสอบทุกสนาม ใครเริ่มช้าก็ทำคะแนนปังได้</span>
      <button style={closeButtonStyle} onClick={closePromote}>
        ✖
      </button>
    </div>
  );
}

export default HeaderPromote;
