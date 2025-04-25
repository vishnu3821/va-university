import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './HomePage';
import RegistrationForm from './RegistrationForm';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Timetable from './pages/Timetable';
import Fees from './pages/Fees';
import CourseRegistration from './pages/CourseRegistration';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

function App() {
  const [student, setStudent] = useState(null);
  const [showLogin, setShowLogin] = useState(false); // for popup login

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const savedStudent = sessionStorage.getItem('student');

    if (token && savedStudent) {
      setStudent(JSON.parse(savedStudent));
    }
  }, []);

  const handleLogin = (studentData) => {
    setStudent(studentData);
    sessionStorage.setItem('student', JSON.stringify(studentData));
    sessionStorage.setItem('token', studentData.token);
    setShowLogin(false); // Close popup on successful login
  };

  const handleLogout = () => {
    setStudent(null);
    sessionStorage.removeItem('student');
    sessionStorage.removeItem('token');
  };

  return (
    <Router>
      <Routes>
        {/* Home Page with Popup Login */}
        <Route path="/" element={
          student ? <Navigate to="/dashboard" replace /> : 
          <HomePage
            onLoginClick={() => setShowLogin(true)}
            showLogin={showLogin}
            onLogin={handleLogin}
          />
        } />

        {/* Student Registration */}
        <Route path="/registration" element={
          student ? <Navigate to="/dashboard" replace /> : <RegistrationForm />
        } />

        {/* Dashboard */}
        <Route path="/dashboard" element={
          student ? <Dashboard student={student} onLogout={handleLogout} /> : <Navigate to="/" replace />
        } />

        {/* Attendance */}
        <Route path="/attendance" element={
          student ? <Attendance student={student} /> : <Navigate to="/" replace />
        } />

        {/* Timetable */}
        <Route path="/timetable" element={
          student ? <Timetable student={student} /> : <Navigate to="/" replace />
        } />

        {/* Fees */}
        <Route path="/fees" element={
          student ? <Fees student={student} /> : <Navigate to="/" replace />
        } />

        {/* Course Registration */}
        <Route path="/courses" element={
          student ? <CourseRegistration student={student} /> : <Navigate to="/" replace />
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
