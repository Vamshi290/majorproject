import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./HomePage.css"; // Optional: for custom styles

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-bg">
      <div className="homepage-overlay">
        <h1 className="homepage-title">Campus Hub</h1>
        <p className="homepage-subtitle">Lost & Found Portal</p>
        <div className="panel-row">
          <div
            className="panel-card admin-panel animated-panel"
            onClick={() => navigate("/admin")}
          >
            <div className="panel-icon">
              <span role="img" aria-label="admin" style={{ fontSize: 48 }}>🛡️</span>
            </div>
            <h2>Admin Panel</h2>
            <p>Manage, approve, and oversee all lost & found activity.</p>
          </div>
          <div
            className="panel-card student-panel animated-panel"
            onClick={() => navigate("/student")}
          >
            <div className="panel-icon">
              <span role="img" aria-label="student" style={{ fontSize: 48 }}>🎒</span>
            </div>
            <h2>Student Panel</h2>
            <p>Report, search, and recover lost or found items.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
