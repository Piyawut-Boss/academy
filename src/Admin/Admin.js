import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';  

function PaymentTable() {
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);  // Initialize as empty array
  const [users, setUsers] = useState([]);      // Initialize as empty array
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentProofFile, setPaymentProofFile] = useState(null);  // เก็บไฟล์ที่เลือก
  const navigate = useNavigate();

  useEffect(() => {
    // ดึง Role จาก localStorage
    const role = localStorage.getItem('role');

    // ถ้าไม่ใช่ Admin ให้ redirect กลับไปหน้าอื่น เช่น หน้า home
    if (role !== 'Admin') {
      alert('Access Denied: Admins only');
      navigate('/');
      return;
    }

    // ดึงข้อมูล payments ถ้าผู้ใช้เป็น Admin
    axios.get('http://localhost:1337/api/payments?populate=*')
      .then(response => {
        console.log('API Response:', response.data);
        setPayments(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
      });

    // Fetch courses and users for selection
    axios.get('http://localhost:1337/api/courses')
      .then(response => {
        setCourses(response.data.data || []);  // Ensure courses is an array
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });

    axios.get('http://localhost:1337/api/users')
      .then(response => {
        setUsers(response.data.data || []);  // Ensure users is an array
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [navigate]);

  const handleEdit = (payment) => {
    setEditingPayment(payment); // ตั้งค่าข้อมูลที่กำลังจะถูกแก้ไข
    setPaymentProofFile(null);   // รีเซ็ตไฟล์ที่เลือก
  };

  const handleSave = () => {
    // ตรวจสอบว่าเลือกไฟล์ใหม่หรือไม่ หากเลือกแล้วก็ต้องอัปโหลดไฟล์ก่อน
    let formData = new FormData();
    formData.append('data[payment_status]', editingPayment.payment_status);
    formData.append('data[course]', editingPayment.course.id);  // ใช้ course id
    formData.append('data[user]', editingPayment.user.id);      // ใช้ user id
    if (paymentProofFile) {
      formData.append('files[payment_proof]', paymentProofFile);  // เพิ่มไฟล์ที่เลือก
    }

    // ทำการอัปเดต payment
    axios.put(`http://localhost:1337/api/payments/${editingPayment.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',  // เนื่องจากมีการอัปโหลดไฟล์
      }
    })
    .then(response => {
      console.log('Payment updated:', response.data);
      setPayments(payments.map(payment =>
        payment.id === editingPayment.id ? { ...editingPayment, payment_proof: response.data.data.payment_proof } : payment
      ));
      setEditingPayment(null); // ปิดโหมดแก้ไข
    })
    .catch(error => {
      console.error('Error updating payment:', error);
    });
  };

  const handleCancel = () => {
    setEditingPayment(null); // ปิดโหมดแก้ไข
  };

  return (
    <div>
      <h2>Payment Records</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Payment Status</th>
            <th>Course</th>
            <th>User</th>
            <th>Payment Proof</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>
                {editingPayment?.id === payment.id ? (
                  <select
                    value={editingPayment.payment_status}
                    onChange={(e) => setEditingPayment({
                      ...editingPayment,
                      payment_status: e.target.value
                    })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                ) : (
                  payment.payment_status || 'N/A'
                )}
              </td>
              <td>
                {editingPayment?.id === payment.id ? (
                  <select
                    value={editingPayment.course?.id || ''}
                    onChange={(e) => setEditingPayment({
                      ...editingPayment,
                      course: courses.find(course => course.id === parseInt(e.target.value))
                    })}
                  >
                    <option value="">Select Course</option>
                    {Array.isArray(courses) && courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.Title}
                      </option>
                    ))}
                  </select>
                ) : (
                  payment.course?.Title || 'N/A'
                )}
              </td>
              <td>
                {editingPayment?.id === payment.id ? (
                  <select
                    value={editingPayment.user?.id || ''}
                    onChange={(e) => setEditingPayment({
                      ...editingPayment,
                      user: users.find(user => user.id === parseInt(e.target.value))
                    })}
                  >
                    <option value="">Select User</option>
                    {Array.isArray(users) && users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                ) : (
                  payment.user?.username || 'N/A'
                )}
              </td>
              <td>
                {editingPayment?.id === payment.id ? (
                  <input
                    type="file"
                    onChange={(e) => setPaymentProofFile(e.target.files[0])}
                  />
                ) : (
                  payment.payment_proof ? (
                    <a 
                      href={`http://localhost:1337${payment.payment_proof.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View Proof
                    </a>
                  ) : 'No Proof'
                )}
              </td>
              <td>
                {editingPayment?.id === payment.id ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(payment)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentTable;
