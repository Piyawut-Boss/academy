import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditPayment.css';

function EditPayment() {
  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const navigate = useNavigate();

  const token = '026d08263b3ead716ea4e5b42c788650b0ab4a29f5a51f53d20cd1fb7262636f9a326a1cf4e236e1d5f474ae74b2a54fb57eef2413430ec925fc5cb550114572975324b04adfc8bf0f4adf8c5584b3148ea8d7c1729a996e6a56be2a2c7fe3d909a435bca999ca8ac8e6b3ac8ec222b8d840310e8352e5a47e297ad1893ed245';

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Admin') {
      alert('Access Denied: Admins only');
      navigate('/');
      return;
    }

    axios.get('http://localhost:1337/api/payments?populate=*')
      .then(response => {
        console.log('API Response:', response.data);
        setPayments(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
        setPayments([]);
      });
  }, [navigate]);

  const handleEdit = (payment) => {
    setEditingPayment(JSON.parse(JSON.stringify(payment)));
  };

  const handleSave = () => {
    if (!editingPayment || !editingPayment.documentId) {
      alert('Missing payment information');
      return;
    }

    console.log("Editing Payment:", editingPayment);
    console.log("Document ID:", editingPayment.documentId);
    console.log("Course:", editingPayment.course);
    console.log("User:", editingPayment.user);

    const updateData = {
      data: {
        payment_status: editingPayment.payment_status
      }
    };

    console.log("Update Data:", updateData);


    axios.put(`http://localhost:1337/api/payments/${editingPayment.documentId}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        // Refresh the data after successful update
        return axios.get('http://localhost:1337/api/payments?populate=*');
      })
      .then(response => {
        setPayments(response.data.data);
        setEditingPayment(null);
      })
      .catch(error => {
        console.error('Error updating payment:', error);
        alert('Failed to update payment. Please try again.');
      });
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
                {payment.course?.Title || 'N/A'}
              </div>
              <div className="table-cell">
                {payment.user?.username || 'N/A'}
              </div>
              <div className="table-cell">
                {payment.payment_proof ? (
                  <a
                    href={`http://localhost:1337${payment.payment_proof.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Proof
                  </a>
                ) : (
                  'No Proof'
                )}
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
    </div>
  );
}

export default EditPayment;