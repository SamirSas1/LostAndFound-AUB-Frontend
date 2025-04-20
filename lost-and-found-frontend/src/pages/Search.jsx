import React, { useEffect, useState } from "react";
import "../styles/Search.css";

const Search = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/get-verified-found-items")
      .then((res) => res.json())
      .then((data) => {
        const parsedItems = Array.isArray(data) ? data : JSON.parse(data.body);
        setItems(parsedItems);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch verified items:", err);
      });
  }, []);

  return (
    <div className="search-page">
      <h1 className="search-title">✅ Verified Found Items</h1>
      <div className="item-grid">
        {items.map((item) => (
          <div key={item.itemId} className="item-card">
            <img
              src={
                item.imageUrl.startsWith("s3://")
                  ? item.imageUrl.replace(
                      "s3://aub-lostfound-images/",
                      "https://aub-lostfound-images.s3.eu-west-1.amazonaws.com/"
                    )
                  : item.imageUrl
              }
              alt={item.title}
            />
            <div className="info">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p className="timestamp">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
