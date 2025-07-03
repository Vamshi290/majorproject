import { useState, useEffect } from "react";
import axios from "axios";

const Result = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch both found and lost items from backend
    Promise.all([
      axios.get("http://localhost:3001/founditems"), // Found Items API
      axios.get("http://localhost:3001/lostitems"),  // Lost Items API
    ])
      .then(([foundResponse, lostResponse]) => {
        const combinedItems = [...foundResponse.data, ...lostResponse.data];
        setItems(combinedItems);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-primary text-center">Approved Found & Lost Items</h2>

      {items.length > 0 ? (
        <div className="row">
          {items.map((item) => (
            <div key={item._id} className="col-md-4 mb-3">
              <div className="card shadow-sm border-0">
                {/* Display Image if Available */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title text-dark">{item.name}</h5>
                  <p className="card-text"><strong>Contact:</strong> {item.contactNumber}</p>
                  <p className="card-text"><strong>Description:</strong> {item.description}</p>
                  <p className="card-text"><strong>Location:</strong> {item.location}</p>
                  
                  {/* Show "Approved" instead of Status */}
                  <p className="badge bg-success">Approved</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted mt-4">No approved items found.</p>
      )}
    </div>
  );
};

export default Result;
