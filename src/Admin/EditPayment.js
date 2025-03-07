import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';
import './EditPayment.css';
import config from '../config';

const API_BASE = config.apiBaseUrl;
const token = config.apiToken;

function EditPayment() {
  const [payments, setPayments] = useState([]);
  const [, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [, setSelectedFile] = useState(null);
  const [, setPreviewImage] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterUser, setFilterUser] = useState('All');
  const navigate = useNavigate();




  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Admin') {
      alert('Access Denied: Admins only');
      navigate('/');
      return;
    }

    axios.get(`${API_BASE}/api/payments?populate=*`)
      .then(response => {
        console.log('API Response:', response.data);
        setPayments(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
        setPayments([]);
      });

    axios.get(`${API_BASE}/api/courses`)
      .then(response => {
        setCourses(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });

    axios.get(`${API_BASE}/api/users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [navigate]);

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setPreviewImage(payment.payment_proof ? `${API_BASE}${payment.payment_proof.url}` : null);
  };

  const handleSave = async () => {
    if (!editingPayment || !editingPayment.documentId) {
      alert('Missing payment information');
      return;
    }

    try {
      const updateData = {
        data: {
          payment_status: editingPayment.payment_status
        }
      };

      // อัปเดตสถานะการชำระเงิน
      await axios.put(
        `${API_BASE}/api/payments/${editingPayment.documentId}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ถ้าเปลี่ยนเป็น Approved ให้เพิ่มคอร์สให้กับ User
      if (editingPayment.payment_status === 'Approved') {
        const userId = editingPayment.user?.id;
        const courseIds = editingPayment.courses?.map(course => course.id) || [];

        if (userId && courseIds.length > 0) {
          // ดึงข้อมูล user ปัจจุบัน
          const userResponse = await axios.get(
            `${API_BASE}/api/users/${userId}?populate=courses`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const existingCourses = userResponse.data.courses.map(course => course.id);
          const updatedCourses = [...new Set([...existingCourses, ...courseIds])]; // ป้องกันการเพิ่มคอร์สซ้ำซ้อน

          await axios.put(
            `${API_BASE}/api/users/${userId}`,
            { courses: updatedCourses },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      }

      // รีเฟรชข้อมูลหลังอัปเดตสำเร็จ
      const response = await axios.get(`${API_BASE}/api/payments?populate=*`);
      setPayments(response.data.data);
      setEditingPayment(null);
      setSelectedFile(null);
      setPreviewImage(null);
      message.success('Payment status updated successfully!');
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment. Please try again.');
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalVisible(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalVisible(false);
    setSelectedImage(null);
  };

  
  const filteredPayments = [...payments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
    .filter(payment => {
      const statusMatch = filterStatus === 'All' || payment.payment_status === filterStatus;
      const userMatch = filterUser === 'All' || payment.user?.documentId === filterUser;
      return statusMatch && userMatch;
    });


  return (
    <div className="edit-user-container">
      <h1>Payment Records</h1>
      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="filterStatus">Filter by Payment Status:</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filterUser">Filter by User:</label>
          <select
            id="filterUser"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <option value="All">All</option>
            {users.map(user => (
              <option key={user.documentId} value={user.documentId}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell">Payment Status</div>
            <div className="table-cell">User</div>
            <div className="table-cell">Course</div>
            <div className="table-cell">Payment Proof</div>
            <div className="table-cell">Payment Price</div>
            <div className="table-cell">Updated At</div>
            <div className="table-cell">Action</div>
          </div>
        </div>
        <div className="table-body">
          {filteredPayments.map(payment => (
            <div className="table-row" key={payment.documentId}>
              <div className="table-cell">
                {editingPayment && editingPayment.documentId === payment.documentId ? (
                  <select
                    value={editingPayment.payment_status}
                    onChange={(e) =>
                      setEditingPayment({
                        ...editingPayment,
                        payment_status: e.target.value,
                      })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                ) : (
                  payment.payment_status || 'N/A'
                )}
              </div>
              <div className="table-cell">
                {payment.user?.username || 'N/A'}
              </div>
              <div className="table-cell">
                {payment.courses && payment.courses.length > 0
                  ? payment.courses.map((course, index) => (
                    <div key={index}>{course.Title}</div>
                  ))
                  : 'N/A'}
              </div>
              <div className="table-cell">
                {payment.payment_proof ? (
                  <img
                    src={`${API_BASE}${payment.payment_proof.url}`}
                    alt="Payment Proof"
                    className="payment-proof-image"
                    onClick={() => handleImageClick(`${API_BASE}${payment.payment_proof.url}`)}
                  />
                ) : (
                  'No Proof'
                )}
              </div>
              <div className="table-cell">
                {payment?.totalAmount ? `${payment.totalAmount.toLocaleString()} บาท` : 'N/A'}
              </div>
              <div className="table-cell">
                {new Date(payment.updatedAt).toLocaleDateString() || 'N/A'}
              </div>
              <div className="table-cell">
                {editingPayment && editingPayment.documentId === payment.documentId ? (
                  <div className="button-group">
                    <button onClick={handleSave}>Save</button>
                    <button className="cancel" onClick={() => setEditingPayment(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleEdit(payment)}>Edit</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <Modal visible={isImageModalVisible} footer={null} onCancel={handleImageModalClose}>
        <img src={selectedImage} alt="Payment Proof" style={{ width: '100%' }} />
      </Modal>
    </div>
  );
}

export default EditPayment;