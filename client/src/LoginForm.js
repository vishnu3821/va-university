import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      if (response.data.token) {
        // Save JWT token
        sessionStorage.setItem('token', response.data.token);

        // Extract full student info from response
        const studentData = {
          email: response.data.email,
          name: response.data.name,
          roll_no: response.data.roll_no,
          student_id: response.data.student_id,
        };

        // Update app state with student info
        onLogin(studentData);

        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Invalid email or password. Please try again.');
      console.error('Login error:', error);
    }
  };

  // Redirect to registration page
  const handleRegisterRedirect = () => {
    navigate('/registration');
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <h1 className="title">VA University</h1>
      </header>

      <div className="login-box">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Student Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <div className="login-buttons">
          <button onClick={() => alert('Help Desk: help@vauniversity.in')}>Help</button>
          <button onClick={() => alert('Contact: +91 98765 43210')}>Contact</button>
        </div>

        {/* Register Button */}
        <div className="register-section">
          <button onClick={handleRegisterRedirect} className="register-btn">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
