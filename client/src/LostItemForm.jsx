import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LostItemForm = () => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('contactNumber', contactNumber);
    formData.append('description', description);
    formData.append('location', location);
    if (image) {
      formData.append('image', image);
    }

    axios
      .post('http://127.0.0.1:3001/lostitems', formData)
      .then((response) => {
        console.log('Item submitted successfully:', response);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error submitting item:', error);
      });
  };

  return (
    <div style={containerStyle}>
      {/* Modern Heading */}
      <div style={headerStyle}>
        <h2 style={headerTextStyle}>🔍 Lost Item Report</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formGroup}>
          <label><strong>Name <span style={required}>*</span></strong></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={formGroup}>
          <label><strong>Contact Number <span style={required}>*</span></strong></label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={formGroup}>
          <label><strong>Description (20 words) <span style={required}>*</span></strong></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength="500"
            required
            style={{ ...inputStyle, height: '100px' }}
          ></textarea>
        </div>

        <div style={formGroup}>
          <label><strong>Location <span style={required}>*</span></strong></label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={formGroup}>
          <label><strong>Upload Image</strong></label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ ...inputStyle, padding: '8px' }}
          />
        </div>

        <div style={{ ...formGroup, display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" id="terms" name="terms" required style={{ marginRight: '10px' }} />
          <label htmlFor="terms">I agree to the <span style={{ color: '#2563eb', fontWeight: 'bold' }}>terms and conditions</span></label>
        </div>

        <button type="submit" style={buttonStyle}>Submit Report</button>
      </form>
    </div>
  );
};

// Inline Styles
const containerStyle = {
  maxWidth: '600px',
  margin: '40px auto',
  padding: '25px',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: 'Segoe UI, sans-serif',
};

const headerStyle = {
  background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
  padding: '14px',
  borderRadius: '8px',
  textAlign: 'center',
  marginBottom: '25px',
};

const headerTextStyle = {
  margin: 0,
  color: '#fff',
  fontSize: '20px',
  fontWeight: 'bold',
};

const formGroup = {
  marginBottom: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '15px',
};

const buttonStyle = {
  width: '100%',
  backgroundColor: '#3b82f6',
  color: '#fff',
  padding: '12px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const required = {
  color: 'red',
};

export default LostItemForm;
