import React from "react";
import { useNavigate } from "react-router-dom";
import "./PanelGrid.css";

function StudentFeatures() {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <h2 className="homepage-title">Student Dashboard</h2>
      <div className="panel-row">
        <div className="panel-card" onClick={() => navigate("/student/lostfound")}>
          <h3>Lost/Found Item Report</h3>
          <p>Report a lost or found item.</p>
        </div>
        <div className="panel-card" onClick={() => navigate("/student/lost")}>
          <h3>Lost Items</h3>
          <p>View all reported lost items.</p>
        </div>
        <div className="panel-card" onClick={() => navigate("/student/found")}>
          <h3>Found Items</h3>
          <p>View all reported found items.</p>
        </div>
        <div className="panel-card" onClick={() => navigate("/student/approved")}>
          <h3>Approved Items</h3>
          <p>See items approved by admin.</p>
        </div>
        <div className="panel-card" onClick={() => navigate("/student/aboutus")}>
          <h3>About Us</h3>
          <p>Learn more about this platform.</p>
        </div>
      </div>
    </div>
  );
}

export default StudentFeatures;
