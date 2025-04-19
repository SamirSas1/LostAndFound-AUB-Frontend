import React, { useEffect, useState } from "react";
import "../styles/Search.css";

const Search = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/get-verified-found-items")
    .then((res) => res.json())
    .then((data) => {
      const parsedItems = JSON.parse(data.body); // ✅ manually parse body
      setItems(parsedItems);
    })
    .catch((err) => {
      console.error("❌ Failed to fetch verified items:", err);
    });
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

export default Search;
