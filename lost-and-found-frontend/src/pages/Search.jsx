import React, { useEffect, useState } from "react";
import "../styles/Search.css";

const Search = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/get-verified-found-items")
      .then((res) => res.json())
      .then((data) => {
        const parsed = Array.isArray(data) ? data : JSON.parse(data.body);
        setItems(parsed);
        setFilteredItems(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch verified items:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (!val.trim()) {
      setFilteredItems(items);
      return;
    }

    const lower = val.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.title?.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower)
    );
    setFilteredItems(filtered);
  };

  return (
    <div className="search-page">
      <h1 className="search-title"> Search Found Items</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={query}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {loading ? (
        <p className="search-loading">Loading items...</p>
      ) : filteredItems.length === 0 ? (
        <p className="no-results">No matching items found.</p>
      ) : (
        <div className="item-grid">
          {filteredItems.map((item) => (
            <div key={item.itemId} className="item-card">
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
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <div className="info">
                <h2>{item.title}</h2>
                <p><strong>Description:</strong> {item.description}</p>
                <p className="timestamp">
                  <strong>Uploaded:</strong> {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
