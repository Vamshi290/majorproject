import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PanelGrid.css";

const ADMIN_PIN = "1234"; // Change this to your secret PIN

function AdminPanel() {
  const [pin, setPin] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsVerified(true);
      setError("");
    } else {
      setError("Incorrect PIN. Please try again.");
    }
  };

  if (!isVerified) {
    return (
      <div className="homepage-container">
        <h2 className="homepage-title">Admin Panel Access</h2>
        <form onSubmit={handlePinSubmit} style={{ width: 300 }}>
          <div className="mb-3">
            <label htmlFor="admin-pin" className="form-label">
              <strong>Enter Admin PIN</strong>
            </label>
            <input
              type="password"
              id="admin-pin"
              className="form-control"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              autoFocus
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Show the two admin panels after PIN is verified
  return (
    <div className="homepage-container">
      <h2 className="homepage-title">Admin Panel</h2>
      <div className="panel-row">
        <div className="panel-card admin-panel" onClick={() => navigate("/admin/register")}>
          <h2>Admin Sign Up</h2>
          <p>Create a new admin account.</p>
        </div>
        <div className="panel-card admin-panel" onClick={() => navigate("/admin/login")}>
          <h2>Admin Login</h2>
          <p>Login to your admin account.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
