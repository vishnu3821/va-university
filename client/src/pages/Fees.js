import React, { useEffect, useState } from 'react';
import './Fees.css';
import axios from 'axios';

function Fees({ student }) {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    if (student && student.roll_no) {
      const cleanRoll = student.roll_no.trim();
      axios.get(`http://localhost:5000/api/fees/${cleanRoll}`)
        .then(res => {
          console.log('Fees response:', res.data); // debug
          setFees(res.data.filter(f => f.semester && f.status)); // filter valid rows
        })
        .catch(err => console.error('Error loading fees', err));
    }
  }, [student]);
  console.log("Fetching fees for:", student?.roll_no);


  return (
    <div className="fees-page">
      <h2>Fee Details</h2>
      {fees.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee, index) => (
              <tr key={index}>
                <td>{fee.semester}</td>
                <td>₹{fee.total}</td>
                <td>₹{fee.paid}</td>
                <td>{fee.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No fee data available.</p>
      )}
    </div>
  );
}

export default Fees;
