import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

function PaymentTable() {
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Admin') {
      alert('Access Denied: Admins only');
      navigate('/');
      return;
    }

    axios.get('http://localhost:1337/api/payments?populate=*')
      .then(response => setPayments(response.data.data))
      .catch(error => console.error('Error fetching payments:', error));

    axios.get('http://localhost:1337/api/courses')
      .then(response => setCourses(response.data.data || []))
      .catch(error => console.error('Error fetching courses:', error));

    axios.get('http://localhost:1337/api/users')
      .then(response => setUsers(response.data.data || []))
      .catch(error => console.error('Error fetching users:', error));
  }, [navigate]);

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setPaymentProofFile(null);
  };

  const handleSave = () => {
    let formData = new FormData();
    formData.append('data[payment_status]', editingPayment.payment_status);
    formData.append('data[course]', editingPayment.course.id);
    formData.append('data[user]', editingPayment.user.id);
    if (paymentProofFile) {
      formData.append('files[payment_proof]', paymentProofFile);
    }

    axios.put(`http://localhost:1337/api/payments/${editingPayment.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      setPayments(payments.map(payment =>
        payment.id === editingPayment.id ? { ...editingPayment, payment_proof: response.data.data.payment_proof } : payment
      ));
      setEditingPayment(null);
    }).catch(error => console.error('Error updating payment:', error));
  };

  return (
    <div className="edit-user-container">
      <h1>Payment Records</h1>
      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell">Payment Status</div>
            <div className="table-cell">Course</div>
            <div className="table-cell">User</div>
            <div className="table-cell">Payment Proof</div>
            <div className="table-cell">Action</div>
          </div>
        </div>
        <div className="table-body">
          {payments.map(payment => (
            <div className="table-row" key={payment.id}>
              <div className="table-cell">
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
              </div>
              <div className="table-cell">
                {payment.course?.Title || 'N/A'}
              </div>
              <div className="table-cell">
                {payment.user?.username || 'N/A'}
              </div>
              <div className="table-cell">
                {payment.payment_proof ? (
                  <a href={`http://localhost:1337${payment.payment_proof.url}`} target="_blank" rel="noopener noreferrer">
                    View Proof
                  </a>
                ) : 'No Proof'}
              </div>
              <div className="table-cell">
                {editingPayment?.id === payment.id ? (
                  <div className="button-group">
                    <button onClick={handleSave}>Save</button>
                    <button className="cancel" onClick={() => setEditingPayment(null)}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => handleEdit(payment)}>Edit</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaymentTable;
