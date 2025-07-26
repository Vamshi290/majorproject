import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

const AdminPortal = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [approvedItems, setApprovedItems] = useState([]);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios
      .get("https://majorproject-kr7t.onrender.com/lostfound/pending")
      .then((res) => setPendingItems(res.data))
      .catch(() => setMessage("Failed to fetch pending items."));

    axios
      .get("https://majorproject-kr7t.onrender.com/lostfound/approved")
      .then((res) => setApprovedItems(res.data))
      .catch(() => setMessage("Failed to fetch approved items."));

    axios
      .get("https://majorproject-kr7t.onrender.com/lostfound/rejected")
      .then((res) => setRejectedItems(res.data))
      .catch(() => setMessage("Failed to fetch rejected items."));
  };

  const handleStatusChange = (id, status) => {
    axios
      .patch(`https://majorproject-kr7t.onrender.com/lostfound/update/${id}`, { status })
      .then(() => fetchItems())
      .catch(() => setMessage("Failed to update item status."));
  };

  const renderTable = (items, statusColor) => (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Type</th>
          <th>Date</th>
          <th>Description</th>
          <th>Location</th>
          <th>Status</th>
          {statusColor === "warning" && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id}>
            <td>{item.name}</td>
            <td>{item.itemType}</td>
            <td>{new Date(item.date).toLocaleDateString()}</td>
            <td>{item.description}</td>
            <td>{item.location}</td>
            <td>
              <span className={`badge bg-${statusColor} text-dark`}>{item.status}</span>
            </td>
            {statusColor === "warning" && (
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleStatusChange(item._id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleStatusChange(item._id, "rejected")}
                >
                  Reject
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate("/")} className="back-btn">
        ← Back to Home
      </button>
      <div className="tabs">
        {["pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? "active-tab" : ""} ${
              tab === "pending" ? "pending" : tab === "approved" ? "approved" : "rejected"
            }`}
          >
            {tab === "pending" ? "Pending Items" : tab === "approved" ? "Approved Items" : "Rejected Items"}
          </button>
        ))}
      </div>

      {message && <div className="alert alert-danger">{message}</div>}

      <div className="table-container">
        {activeTab === "pending" && (
          <div>
            <h4>Pending Items</h4>
            {pendingItems.length === 0 ? (
              <p>No pending items.</p>
            ) : (
              renderTable(pendingItems, "warning")
            )}
          </div>
        )}

        {activeTab === "approved" && (
          <div>
            <h4>Approved Items</h4>
            {approvedItems.length === 0 ? (
              <p>No approved items.</p>
            ) : (
              renderTable(approvedItems, "success")
            )}
          </div>
        )}

        {activeTab === "rejected" && (
          <div>
            <h4>Rejected Items</h4>
            {rejectedItems.length === 0 ? (
              <p>No rejected items.</p>
            ) : (
              renderTable(rejectedItems, "danger")
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
