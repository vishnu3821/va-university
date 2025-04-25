import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [rollNo, setRollNo] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/admin/students/count')
      .then(res => setStudentCount(res.data.count))
      .catch(err => console.error(err));
  }, []);

  const fetchAttendance = () => {
    if (!rollNo) return;
    axios.get(`http://localhost:5000/admin/attendance/${rollNo}`)
      .then(res => setAttendanceData(res.data))
      .catch(() => alert('No attendance data found'));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      <p>Total Registered Students: <strong>{studentCount}</strong></p>

      <div style={{ marginTop: '30px' }}>
        <h3>Search Attendance by Roll No</h3>
        <input value={rollNo} onChange={(e) => setRollNo(e.target.value)} placeholder="Enter Roll No" />
        <button onClick={fetchAttendance}>Search</button>

        {attendanceData.length > 0 && (
          <table border="1" style={{ marginTop: '20px', width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((row, index) => (
                <tr key={index}>
                  <td>{row.course_name} ({row.code})</td>
                  <td>{row.date}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
