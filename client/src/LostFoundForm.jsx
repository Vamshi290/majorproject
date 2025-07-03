import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LostFoundForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [itemType, setItemType] = useState('lost');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('date', date);
    formData.append('itemType', itemType);
    if (image) formData.append('image', image);

    try {
      const response = await axios.post('http://127.0.0.1:3001/lostfound', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Item submitted successfully:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error submitting item:', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      background: '#ffffff',
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* Attractive One-Line Header */}
      <div style={{
        background: 'linear-gradient(to right, #2563eb, #1e3a8a)',
        padding: '16px',
        textAlign: 'center',
        borderRadius: '8px',
        marginBottom: '25px',
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          📌 Lost & Found Item Submission
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label><strong>Item Name <span style={{ color: 'red' }}>*</span></strong></label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label><strong>Category <span style={{ color: 'red' }}>*</span></strong></label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="documents">Documents</option>
            <option value="jewelry">Jewelry</option>
            <option value="bags">Bags</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label><strong>Description <span style={{ color: 'red' }}>*</span></strong></label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ ...inputStyle, height: '100px' }}
          ></textarea>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label><strong>Location <span style={{ color: 'red' }}>*</span></strong></label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label><strong>Date <span style={{ color: 'red' }}>*</span></strong></label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label><strong>Item Type <span style={{ color: 'red' }}>*</span></strong></label>
          <select
            className="form-control"
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label><strong>Upload Image <span style={{ color: 'red' }}>*</span></strong></label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{ ...inputStyle, padding: '8px' }}
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Submit Item
        </button>
      </form>
    </div>
  );
}

// Inline Styles
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
  backgroundColor: '#2563eb',
  color: '#fff',
  padding: '12px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
};

export default LostFoundForm;
