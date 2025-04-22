import React, { useState } from "react";
import "../styles/Search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);

    fetch(`https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/index-lostfound-opensearch?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        const parsed = Array.isArray(data) ? data : JSON.parse(data.body);
        // Filter only verified items
        const verified = parsed.filter((item) => item.isVerified === true);
        setItems(verified);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch search results:", err);
        setLoading(false);
      });
  };

  return (
    <div className="search-page">
      <h1 className="search-title">🔍 Search Found Items</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="item-grid">
          {items.map((item, index) => (
            <div key={index} className="item-card">
              <img
                src={
                  item.imageUrl?.startsWith("s3://")
                    ? item.imageUrl.replace(
                        "s3://aub-lostfound-images/",
                        "https://aub-lostfound-images.s3.eu-west-1.amazonaws.com/"
                      )
                    : item.imageUrl || "https://via.placeholder.com/150"
                }
                alt={item.title}
              />
              <div className="info">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <p className="timestamp">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
