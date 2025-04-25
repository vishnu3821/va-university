// HomePage.js

import React, { useState } from 'react';
import './HomePage.css';
import LoginForm from './LoginForm';

const HomePage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);

  const toggleLoginPopup = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div
      className="homepage-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + '/background.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="overlay">
        <h1 className="homepage-title">VA UNIVERSITY ERP</h1>
        <p className="homepage-tagline">Smart Campus | Smarter You</p>
        <button className="login-btn" onClick={toggleLoginPopup}>
          Login
        </button>
      </div>

      {showLogin && (
        <div className="login-popup">
          <div className="login-popup-content">
            <span className="close-btn" onClick={toggleLoginPopup}>&times;</span>
            <LoginForm onLogin={onLogin} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
