import React, { useEffect, useState } from "react";
import "../styles/Search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [allItems, setAllItems] = useState([]); // all verified items from backend
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all verified items once
    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/index-lostfound-opensearch")
      .then((res) => res.json())
      .then((data) => {
        const parsed = Array.isArray(data) ? data : JSON.parse(data.body);
        const verified = parsed.filter((item) => item.isVerified === true);
        setAllItems(verified);
        setFilteredItems(verified); // show all initially
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
      setFilteredItems(allItems);
      return;
    }

    const lowerQuery = val.toLowerCase();
    const filtered = allItems.filter(
      (item) =>
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );

    setFilteredItems(filtered);
  };

  return (
    <div className="search-page">
      <h1 className="search-title">🔍 Search Found Items</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by keyword..."
          value={query}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="item-grid">
          {filteredItems.map((item, index) => (
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
