import React from "react";
import { useNavigate, Routes, Route, Outlet } from "react-router-dom";
import "./PanelGrid.css"; // Reuse the same CSS as your homepage/admin panel
import StudentSignup from "./StudentSignup";

function StudentPanel() {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <h2 className="homepage-title">Student Panel</h2>
      <div className="panel-row">
        <div className="panel-card student-panel" onClick={() => navigate("/student/register")}>
          <h2>Student Sign Up</h2>
          <p>Create a new student account.</p>
        </div>
        <div className="panel-card student-panel" onClick={() => navigate("/student/login")}>
          <h2>Student Login</h2>
          <p>Access your student dashboard.</p>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default StudentPanel;

<Routes>
  <Route path="register" element={<StudentSignup />} />
</Routes>
