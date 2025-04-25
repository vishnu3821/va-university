// Import dependencies
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 5000; // Use the port from the .env file

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection using values from .env
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// ===================== STUDENT ROUTES ===================== //

// Student Registration
app.post('/register', (req, res) => {
  const { name, roll_no, email, password } = req.body;
  const sql = 'INSERT INTO students (name, roll_no, email, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, roll_no, email, password], (err) => {
    if (err) return res.status(500).json({ message: 'Error registering student' });
    res.json({ message: 'Student registered successfully' });
  });
});

// Student Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM students WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length > 0) {
      const student = results[0];
      res.json({
        token: 'dummy-token', // Replace with actual JWT token if implemented
        student_id: student.id,
        roll_no: student.roll_no,
        name: student.name,
        email: student.email,
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Get Attendance for student
app.get('/api/attendance/:roll_no', (req, res) => {
  const rollNo = req.params.roll_no.trim();
  const query = 'SELECT * FROM attendance WHERE roll_no = ?';
  db.query(query, [rollNo], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(results);
  });
});

// Get Fees by Roll No
app.get('/api/fees/:roll_no', (req, res) => {
  const rollNo = req.params.roll_no.trim();
  const sql = 'SELECT semester, total, paid, status FROM fees WHERE roll_no = ?';
  db.query(sql, [rollNo], (err, result) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });
    res.json(result);
  });
});

// ✅ Corrected backend route
app.get('/api/timetable/:roll_no', (req, res) => {
  const rollNo = req.params.roll_no.trim();
  db.query('SELECT * FROM timetable WHERE roll_no = ?', [rollNo], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to load timetable' });
    res.json(result);
  });
});

// Get Available Courses
app.get('/api/courses', (req, res) => {
  const sql = `
    SELECT * FROM courses 
    WHERE instructor IS NOT NULL 
    AND schedule IS NOT NULL 
    AND credits IS NOT NULL
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send('Error fetching courses');
    res.json(result);
  });
});

// Register for a Course
app.post('/api/register-course', (req, res) => {
  const { student_id, course_id } = req.body;
  const checkQuery = 'SELECT * FROM course_registrations WHERE student_id = ? AND course_id = ?';

  db.query(checkQuery, [student_id, course_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error checking registration' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'Already registered for this course' });
    }

    const insertQuery = 'INSERT INTO course_registrations (student_id, course_id) VALUES (?, ?)';
    db.query(insertQuery, [student_id, course_id], (err) => {
      if (err) return res.status(500).json({ message: 'Error registering for course' });
      res.json({ message: 'Course registered successfully' });
    });
  });
});

// Get Registered Courses
app.get('/api/registered-courses/:student_id', (req, res) => {
  const studentId = req.params.student_id;
  const sql = `
    SELECT cr.course_id, c.code, c.name, c.instructor, c.schedule, c.credits
    FROM course_registrations cr
    JOIN courses c ON cr.course_id = c.course_id
    WHERE cr.student_id = ?
  `;
  db.query(sql, [studentId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error fetching registered courses' });
    res.json(result);
  });
});

// ===================== ADMIN ROUTES ===================== //

// Admin Login
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  // Hardcoded credentials for now
  if (email === 'admin@vauniversity.in' && password === 'admin123') {
    res.json({ success: true, message: 'Admin login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }
});

// Get total student count
app.get('/admin/students/count', (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM students', (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to count students' });
    res.json(result[0]);
  });
});

// Search attendance by roll number
app.get('/admin/attendance/:roll_no', (req, res) => {
  const { roll_no } = req.params;
  const query = `
    SELECT a.*, c.code, c.name AS course_name 
    FROM attendance a
    JOIN courses c ON a.course_id = c.id
    WHERE a.roll_no = ?
  `;
  db.query(query, [roll_no], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch attendance' });
    res.json(result);
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
