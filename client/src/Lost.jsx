import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Lost = () => {
  const [lostItems, setLostItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [zoomedImage, setZoomedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:3001/lostfound/lost')
      .then(response => {
        setLostItems(response.data);
        setFilteredItems(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching lost items. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = lostItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date).toLocaleDateString('en-GB');
        return itemDate === new Date(selectedDate).toLocaleDateString('en-GB');
      });
    }

    setFilteredItems(filtered);
  }, [searchQuery, selectedDate, lostItems]);

  const handleImageClick = (image) => {
    setZoomedImage(image);
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
  };

  const handleFoundButtonClick = (itemId) => {
    
    navigate(`/found/${itemId}`);
  };

  if (loading) {
    return <div>Loading lost items...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Lost Items</h2>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '5px', fontSize: '1rem' }}
        />
      </div>
      <input 
        type="text" 
        placeholder="Search items by name..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          fontSize: '1rem'
        }}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px',
      }}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item._id} style={{
              background: '#f9f9f9',
              border: '1px solid #ddd',
              padding: '10px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{ marginBottom: '10px' }}>
                <h3 style={{ margin: '0', fontSize: '1.2rem', fontWeight: 'bold' }}><strong>Item name: </strong>{item.name}</h3>
                <p style={{ margin: '8px 0', fontSize: '0.9rem' }}><strong>Category: </strong>{item.category}</p>
                <p style={{ margin: '8px 0', fontSize: '0.9rem' }}><strong>Description: </strong>{item.description}</p>
                <p style={{ margin: '8px 0', fontSize: '0.9rem' }}><strong>Posted On:</strong> {new Date(item.date).toLocaleDateString()}</p>
                <p style={{ margin: '8px 0', fontSize: '0.9rem' }}><strong>Location:</strong> {item.location}</p>
              </div>
              <div>
                <img
                  src={`http://127.0.0.1:3001/${item.image}`}
                  alt={item.name}
                  width="200"
                  style={{ cursor: 'pointer', transition: 'transform 0.2s ease', borderRadius: '8px', maxWidth: '100%' }}
                  onClick={() => handleImageClick(`http://127.0.0.1:3001/${item.image}`)}
                />
              </div>
              <button
                style={{
                  marginTop: '10px',
                  padding: '10px 20px',
                  background: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                onClick={() => handleFoundButtonClick(item._id)}
              >
                Found
              </button>
            </div>
          ))
        ) : (
          <div>No records found</div>
        )}
      </div>
      {zoomedImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }} onClick={handleCloseZoom}>
          <img
            src={zoomedImage}
            alt="Zoomed"
            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px' }}
          />
          <button
            onClick={handleCloseZoom}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '10px',
              background: '#ff0000',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.5rem',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Lost;
