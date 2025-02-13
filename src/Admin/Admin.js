import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentTable() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:1337/api/payments', {
      params: {
        populate: {
          course: { fields: ['name'] }, // ดึงเฉพาะชื่อคอร์ส
          user: { fields: ['username'] }, // ดึงเฉพาะ username ของผู้ใช้
          payment_proof: { fields: ['url'] } // ดึง URL ของไฟล์แนบ
        }
      }
    })
    .then(response => {
      console.log('API Response:', response.data); // Debug ข้อมูล
      setPayments(response.data.data);
    })
    .catch(error => {
      console.error('Error fetching payments:', error);
    });
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.attributes?.payment_status || 'N/A'}</td>
              <td>{payment.attributes?.course?.data?.attributes?.name || 'N/A'}</td>
              <td>{payment.attributes?.user?.data?.attributes?.username || 'N/A'}</td>
              <td>
                {payment.attributes?.payment_proof?.data ? (
                  <a 
                    href={`http://localhost:1337${payment.attributes.payment_proof.data.attributes.url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Proof
                  </a>
                ) : 'No Proof'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentTable;
