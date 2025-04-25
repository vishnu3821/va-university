import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CourseRegistration.css';

function CourseRegistration({ student }) {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [registeredCourses, setRegisteredCourses] = useState([]);

  useEffect(() => {
    // ✅ Correct endpoint for fetching all valid courses
    axios.get('http://localhost:5000/api/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error('Error loading courses', err));

    if (student?.student_id) {
      // ✅ Correct endpoint for registered courses (using student_id)
      axios.get(`http://localhost:5000/api/registered-courses/${student.student_id}`)
        .then(res => setRegisteredCourses(res.data.map(c => c.course_id)))
        .catch(err => console.error('Error loading registered courses', err));
    }
  }, [student]);

  const handleRegister = (course_id) => {
    // ✅ Correct POST to register course
    axios.post('http://localhost:5000/api/register-course', {
      student_id: student.student_id,
      course_id
    })
      .then(() => {
        setRegisteredCourses(prev => [...prev, course_id]);
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Registration failed');
      });
  };

  const filteredCourses = courses.filter(course =>
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="registration-container">
      <h2>Course Registration</h2>
      <p className="subtitle">Browse and register for available courses for the current semester</p>

      <input
        type="text"
        placeholder="Search courses by ID or name..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredCourses.length > 0 ? (
        <table className="course-table">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Instructor</th>
              <th>Schedule</th>
              <th>Credits</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course, idx) => (
              <tr key={idx}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.instructor}</td>
                <td>{course.schedule}</td>
                <td>{course.credits}</td>
                <td>
                  {registeredCourses.includes(course.course_id) ? (
                    <button className="registered-btn" disabled>Registered</button>
                  ) : (
                    <button className="register-btn" onClick={() => handleRegister(course.course_id)}>Register</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No available courses found.</p>
      )}
    </div>
  );
}

export default CourseRegistration;
