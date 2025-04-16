import React, { useEffect, useState } from "react";
import '../styles/Search.css';
const Search = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // TODO: Replace this with actual API call
    const mockData = [
      {
        id: 1,
        title: "USB Drive",
        description: "Black 32GB USB found near the library",
        timestamp: "2025-04-15 13:42",
        imageUrl:
          "https://aub-lostfound-images.s3.eu-west-1.amazonaws.com/found/usb1.jpg",
      },
      {
        id: 2,
        title: "Water Bottle",
        description: "Blue reusable bottle left in OSB building",
        timestamp: "2025-04-15 09:15",
        imageUrl:
          "https://aub-lostfound-images.s3.eu-west-1.amazonaws.com/found/bottle2.jpg",
      },
    ];
    setItems(mockData);
  }, []);

  return (
    <div className="search-page">
      <h1 className="search-title">Verified Found Items</h1>
      <div className="item-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img src={item.imageUrl} alt={item.title} />
            <div className="info">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p className="timestamp">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
