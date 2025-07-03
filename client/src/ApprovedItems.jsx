import React, { useEffect, useState } from "react";
import axios from "axios";

function ApprovedItems() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/lostfound/approved")
      .then((res) => setItems(res.data))
      .catch(() => setMessage("Failed to fetch approved items."));
  }, []);

  return (
    <div className="container mt-5">
      <h2>Approved Items</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      {items.length === 0 ? (
        <p>No approved items found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Description</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.itemType}</td>
                <td>{item.status}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.description}</td>
                <td>{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ApprovedItems;
