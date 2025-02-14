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
  const { isPromoteVisible, closePromote } = useHeaderPromote(); 

  if (!isPromoteVisible) return null; 

  const promoteStyle = {
    backgroundColor: '#DD0C0C', 
    color: '#333', 
    textAlign: 'center',
    padding: '10px 20px',
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    zIndex: 1001, 
    height: '50px',
    lineHeight: '50px', 
    boxSizing: 'border-box',
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
    zIndex: 1002, 
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
