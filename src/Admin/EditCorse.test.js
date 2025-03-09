import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditCourse from './EditCourse';
import axios from 'axios';

// Mocking axios เพื่อจำลองการเรียก API
jest.mock('axios');

describe('ทดสอบหน้า EditCourse Component', () => {
  // testcase 1 ตรวจสอบการแสดงผลของหน้า EditCourse
  it('ควรแสดงผลหน้า EditCourse โดยมีข้อมูลที่จำเป็นแสดงอยู่บนหน้า', async () => {
    axios.get.mockResolvedValueOnce({
      data: { data: [] },
    });

    render(<EditCourse />);

    // รอให้ข้อมูลหลักสูตรโหลดและตรวจสอบการแสดงผล
    await waitFor(() => screen.getByText('Edit Course'));

    expect(screen.getByText('Edit Course')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by course title')).toBeInTheDocument();
    expect(screen.getByText('Create New Course')).toBeInTheDocument();
  });

  // testcase 2 ทดสอบการเปิด Modal popup สำหรับสร้าง course ใหม่
  it('ควรเปิด Create Course Modal เมื่อคลิกปุ่ม "Create New Course"', async () => {
    axios.get.mockResolvedValueOnce({
      data: { data: [] },
    });

    render(<EditCourse />);

    // กดปุ่ม Create New Course
    const createNewCourseButton = screen.getByText('Create New Course');
    fireEvent.click(createNewCourseButton);

    // ตรวจสอบว่า Modal popup สำหรับสร้าง course ใหม่เปิดขึ้น
    expect(screen.getByText('Create New Course')).toBeInTheDocument();
  });

  // testcase 3 test function การ search course
  it('ควรกรองและแสดงผลหลักสูตรที่ตรงกับคำค้นหาจากช่องค้นหา', async () => {
    axios.get.mockResolvedValueOnce({
      data: { data: [{ Title: 'Test Course', documentId: 1 }] },
    });

    render(<EditCourse />);

    await waitFor(() => screen.getByText('Test Course'));

    // check ว่า Course "Test Course" แสดงขึ้น
    expect(screen.getByText('Test Course')).toBeInTheDocument();

    // search ด้วยคำว่า "Test"
    fireEvent.change(screen.getByPlaceholderText('Search by course title'), {
      target: { value: 'Test' },
    });

    // check ว่า "Test Course" ยังคงแสดงหลังจากค้นหา
    expect(screen.getByText('Test Course')).toBeInTheDocument();
  });

  // test case 4: test การเปิด Modal popup สำหรับแก้ไข course
  it('ควรเปิด Edit Course Modal เมื่อคลิกปุ่ม "Edit" ของหลักสูตรที่ต้องการแก้ไข', async () => {
    const mockCourse = {
      Title: 'Course 1',
      Description: 'Course 1 Description',
      Detail: 'Course 1 Detail',
      Price: 100,
      realprice: 90,
      units: [],
      documentId: 1,
    };

    axios.get.mockResolvedValueOnce({
      data: { data: [mockCourse] },
    });

    render(<EditCourse />);

    await waitFor(() => screen.getByText('Course 1'));

    // dfปุ่ม "Edit" ของ course ที่ต้องการแก้ไข
    const editCourseButton = screen.getByText('Edit');
    fireEvent.click(editCourseButton);

    // check ว่า Modal สำหรับแก้ไข course เปิดขึ้น
    expect(screen.getByText('Edit Course Details')).toBeInTheDocument();
  });

  // กรณีทดสอบที่ 5: ทดสอบการลบ course 
  it('ควรเรียก API เพื่อลบหลักสูตรเมื่อคลิกปุ่ม "Delete" ของหลักสูตรที่ต้องการลบ', async () => {
    const mockCourse = {
      Title: 'Course 1',
      Description: 'Course 1 Description',
      Detail: 'Course 1 Detail',
      Price: 100,
      realprice: 90,
      units: [],
      documentId: 1,
    };

    axios.get.mockResolvedValueOnce({
      data: { data: [mockCourse] },
    });
    axios.delete.mockResolvedValueOnce({});

    render(<EditCourse />);

    await waitFor(() => screen.getByText('Course 1'));

    // กดปุ่ม "Delete" ของ course ที่ต้องการลบ
    const deleteCourseButton = screen.getByText('Delete');
    fireEvent.click(deleteCourseButton);

    // check ว่า API สำหรับลบ course ถูกเรียกใช้
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining(`/api/courses/${mockCourse.documentId}`)
    );
  });
});
