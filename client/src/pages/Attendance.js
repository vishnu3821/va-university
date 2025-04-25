import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Attendance({ student }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (student?.roll_no) {
      axios.get(`http://localhost:5000/attendance/${student.roll_no}`)
        .then(res => setData(res.data))
        .catch(err => console.error(err));
    }
  }, [student]);

  return (
    <div>
      <h2>Attendance - Roll No: {student?.roll_no}</h2>
      <table>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.course_code}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Attendance;