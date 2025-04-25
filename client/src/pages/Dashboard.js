import React from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';

import {
  FaUserCircle,
  FaChalkboard,
  FaClipboardList,
  FaBookOpen,
  FaCog,
  FaSignOutAlt,
  FaMoneyBillWave
} from 'react-icons/fa';

const Dashboard = ({ student, onLogout }) => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">🎓 VA University</h2>
        <nav className="nav-links">
          <Link to="/dashboard"><FaUserCircle /> Dashboard</Link>
          <Link to="/registration"><FaClipboardList /> Registration</Link>
          <Link to="/timetable"><FaChalkboard /> Timetable</Link>
          <Link to="/attendance"><FaBookOpen /> Attendance</Link>
          <Link to="/courses"><FaBookOpen /> Courses</Link>
          <Link to="/fees"><FaMoneyBillWave /> Fees</Link> {/* ✅ Added Fees link */}
          <Link to="/settings"><FaCog /> Settings</Link>
        </nav>
        <div className="sidebar-footer">
          <p><strong>{student?.email || "student@vauniversity.in"}</strong></p>
          <small>Student Access</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Welcome, {student?.name || "Student"}</h1>
          <p>Roll No: {student?.roll_no || "N/A"}</p>
        </header>

        <section className="dashboard-section">
          <h2>Your Dashboard Overview</h2>
          <div className="cards-grid">
            <div className="card">📚 Registered Courses: 5</div>
            <div className="card">📅 Upcoming Classes: 3</div>
            <div className="card">📈 Attendance: 92%</div>
            <div className="card">🎯 Semester: Spring 2025</div>
          </div>
        </section>

        {/* Logout Button */}
        <button onClick={onLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
