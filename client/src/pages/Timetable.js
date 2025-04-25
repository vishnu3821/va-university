import React, { useEffect, useState } from 'react';
import './Timetable.css';
import axios from 'axios';

function Timetable({ student }) {
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student && student.roll_no) {
      axios
        .get(`http://localhost:5000/api/timetable/${student.roll_no}`)
        .then(res => {
          console.log("Timetable Data:", res.data);
          setSchedule(res.data);
          setError('');
        })
        .catch(err => {
          console.error('Error loading timetable:', err);
          setError('Failed to load timetable. Please try again later.');
        });
    }
  }, [student]);

  // Helper to show combined slots for each day
  const renderSlots = (row) => {
    const slots = [];
    for (let i = 1; i <= 6; i++) {
      if (row[`slot${i}`]) {
        slots.push(row[`slot${i}`]);
      }
    }
    return slots.join(', ');
  };

  return (
    <div className="timetable-page">
      <h2><span role="img" aria-label="calendar">🗓️</span> Weekly Timetable</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : schedule.length > 0 ? (
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Courses</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, idx) => (
              <tr key={idx}>
                <td>{row.day}</td>
                <td>{renderSlots(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading timetable...</p>
      )}
    </div>
  );
}

export default Timetable;
