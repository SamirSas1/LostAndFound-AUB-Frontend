import React from 'react';
import '../styles/MyUploads.css';

const MyUploads = () => {
  // Example items - replace with real data later
  const uploads = [
    {
      id: 1,
      itemName: 'Black Wallet',
      description: 'Black leather wallet found in Bliss Street.',
      date: '2025-04-14 17:30',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      itemName: 'Water Bottle',
      description: 'Blue bottle left in Green Oval.',
      date: '2025-04-12 12:10',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div className="my-uploads-container">
      <h2>My Uploads</h2>
      <div className="uploads-grid">
        {uploads.map((item) => (
          <div className="upload-card" key={item.id}>
            <img src={item.imageUrl} alt={item.itemName} />
            <h3>{item.itemName}</h3>
            <p>{item.description}</p>
            <span>{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyUploads;
