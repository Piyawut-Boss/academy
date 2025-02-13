import React from 'react';
import './Study.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Study = () => {
  const units = [
    { id: 1, title: 'การอ่านจับใจความ T-GAT' },
    { id: 2, title: 'การเขียนคิดวิเคราะห์' },
    { id: 3, title: 'การใช้ภาษาเพื่อการสื่อสาร' },
    { id: 4, title: 'การสรุปความ' },
    { id: 5, title: 'การใช้เหตุผลเชิงภาษา' },
    { id: 6, title: 'การเรียงลำดับข้อมูล' },
    { id: 7, title: 'การใช้เหตุผลเชิงตรรกะ' },
    { id: 8, title: 'วิธีการทำข้อสอบให้ทัน' },
    { id: 9, title: 'การฝึกทำข้อสอบ' },
    { id: 10, title: 'การเตรียม��ัวสอบให้พร้อม' }
  ];

  return (
    <div className="study-container">
      {/* Navigation Bar */}
      <div className="study-nav-bar">
        <button className="study-nav-button">
          <ChevronLeft className="study-icon" />
          <span>Previous</span>
        </button>
        <span className="study-current-unit">บทที่ 2 : การเขียนคิดวิเคราะห์</span>
        <button className="study-nav-button">
          <span>Next</span>
          <ChevronRight className="study-icon" />
        </button>
      </div>

      <div className="study-main-content">
        {/* Main Content */}
        <div className="study-content-area">
          <div className="study-video-container">
            {/* Video Player Placeholder */}
            <div className="study-video-placeholder">
              <img
                src="/api/placeholder/800/450"
                alt="Study workspace with books and desk"
                className="study-video-image"
              />
            </div>

            {/* Content Below Video */}
            <div className="study-content-description">
              <h2>บทที่ 2 : การเขียนคิดวิเคราะห์</h2>
              <p>
                บทนี้จะพาน้องๆ ไปเรียนรู้เกี่ยวกับการเขียนคิดวิเคราะห์ที่จะเป็นส่วนสำคัญในการทำข้อสอบและใช้ในชีวิตประจำวัน โดยจะครอบคลุมทั้งหลักการและวิธีการที่จะช่วยให้น้องๆ ทำข้อสอบ PAT ได้คะแนนดี
              </p>
              <div className="study-pdf-link">
                <a href="#">unit2_การเขียนคิดวิเคราะห์.pdf</a>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="study-sidebar">
          <div className="study-sidebar-content">
            <h3>T-GAT ProMax</h3>
            <ul className="study-unit-list">
              {units.map((unit) => (
                <li
                  key={unit.id}
                  className={unit.id === 2 ? 'active' : ''}
                >
                  <span className="study-unit-number">{unit.id}.</span>
                  <span className="study-unit-title">{unit.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Study;