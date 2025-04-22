import React, { useEffect, useState } from "react";
import "../styles/Search.css";

const StaffDashboard = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cooldowns, setCooldowns] = useState({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/get-all-items-for-staff")
      .then((res) => res.json())
      .then((data) => {
        const parsed = Array.isArray(data) ? data : JSON.parse(data.body);
        setItems(parsed);
        setFilteredItems(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch staff items:", err);
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
        item.description?.toLowerCase().includes(lower) ||
        item.userEmail?.toLowerCase().includes(lower)
    );
    setFilteredItems(filtered);
  };

  const handleDelete = (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/delete-item", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        return res.json();
      })
      .then(() => {
        alert("🗑 Item deleted successfully");
        const updated = items.filter((i) => i.itemId !== itemId);
        setItems(updated);
        setFilteredItems(updated);
      })
      .catch((err) => {
        console.error("❌ Delete failed:", err);
        alert("❌ Failed to delete item.");
      });
  };

  const handleNotify = (itemId) => {
    const item = items.find((i) => i.itemId === itemId);
    if (!item) return alert("❌ Item not found");

    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/notify-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: item.itemId,
        userEmail: item.userEmail,
        title: item.title,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Notification sent to student!");
        startCooldown(itemId);
      })
      .catch((err) => {
        console.error("❌ Notify failed:", err);
        alert("❌ Failed to send notification.");
      });
  };

  const startCooldown = (itemId) => {
    let timeLeft = 60;
    setCooldowns((prev) => ({ ...prev, [itemId]: timeLeft }));

    const interval = setInterval(() => {
      timeLeft -= 1;
      setCooldowns((prev) => ({ ...prev, [itemId]: timeLeft }));

      if (timeLeft <= 0) {
        clearInterval(interval);
        setCooldowns((prev) => {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        });
      }
    }, 1000);
  };

  return (
    <div className="search-page">
      <h1 className="search-title"> All Uploaded Items (Staff View)</h1>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Filter by title, description, or email..."
          value={query}
          onChange={handleSearch}
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
                    : item.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={item.title}
              />
              <div className="info">
                <h2>{item.title}</h2>
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Posted By:</strong> {item.userEmail}</p>
                <p className="timestamp">{new Date(item.timestamp).toLocaleString()}</p>

                <div className="button-group">
                  {cooldowns[item.itemId] ? (
                    <button className="notify-button" disabled>
                      Checked ({cooldowns[item.itemId]}s)
                    </button>
                  ) : (
                    <button
                      className="notify-button"
                      onClick={() => handleNotify(item.itemId)}
                    >
                      Notify Student
                    </button>
                  )}

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(item.itemId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
