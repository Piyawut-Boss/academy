import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import CountdownSection from './Course.js';
import moment from 'moment';

describe('CountdownSection - Integrated Test', () => {
  // Mock ข้อมูลการสอบ
  const mockCountDownData = [
    {
      id: 1,
      ExamName: 'Math Exam',
      EndTime: moment().add(2, 'days').toISOString(), // สอบในอีก 2 วัน
    },
  ];

  // เรียกใช้ fake timers ก่อนการทดสอบทั้งหมด
  beforeAll(() => {
    jest.useFakeTimers();
  });

  // เรียกใช้ real timers หลังการทดสอบทั้งหมด
  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    // Mock การเรียก API โดยตรง
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: mockCountDownData }),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockClear(); // ล้าง mock หลังจากแต่ละการทดสอบ
    delete global.fetch; // ลบ fetch ออกจาก global
  });

  it('should handle exam selection, countdown, and exam date display correctly', async () => {
    // Render คอมโพเนนต์
    render(<CountdownSection />);

    // รอให้ข้อมูลโหลดเสร็จสิ้น
    await waitFor(() => {
      expect(screen.getByText(/Exam countdown/i)).toBeInTheDocument();
    });

    // 1. ทดสอบการเลือกวิชาสอบ
    const selectElement = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(selectElement, { target: { value: '1' } });
    });

    // ตรวจสอบว่าวิชาสอบถูกเลือกและแสดงผลถูกต้อง
    expect(selectElement).toHaveDisplayValue('Math Exam');

    // 2. ทดสอบการนับเวลาถอยหลัง
    // ตรวจสอบว่าเวลาที่เหลือแสดงผลถูกต้อง (1 วัน)
    expect(screen.getByText(/1 days/i)).toBeInTheDocument();

    // จำลองเวลาผ่านไป 1 วัน
    await act(async () => {
      jest.advanceTimersByTime(24 * 60 * 60 * 1000); // 1 วัน
    });

    // ตรวจสอบว่าเวลาที่เหลืออัปเดตถูกต้อง (เหลือ 0 วัน)
    expect(screen.getByText(/0 days/i)).toBeInTheDocument();

    // 3. ทดสอบการแสดงวันที่สอบ
    const formattedDate = moment(mockCountDownData[0].EndTime)
      .locale('en')
      .format('dddd, D MMMM YYYY');
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

});