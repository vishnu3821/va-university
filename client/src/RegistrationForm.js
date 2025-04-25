import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css'; // Optional: For custom styles

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    roll_no: '',
    email: '',
    password: '',
    confirmPassword: '', // Add confirmPassword for validation
  });

  const [errorMessage, setErrorMessage] = useState(''); // To store error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation: Ensure passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    setErrorMessage(''); // Clear any previous error messages

    try {
      const res = await axios.post('http://localhost:5000/register', formData);
      alert(res.data.message);
      // Redirect to login page after successful registration
      window.location.href = '/';
    } catch (err) {
      alert('Registration failed!');
      console.error(err);
    }
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h2>Student Registration</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="roll_no"
          placeholder="Roll Number"
          value={formData.roll_no}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;
