import React, { useEffect, useState } from "react";

const MyUploads = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("userInfo")); // ✅ get user email

  useEffect(() => {
    if (!user?.email) return;

    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/get-my-uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: user.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        const parsed = Array.isArray(data) ? data : JSON.parse(data.body);
        setItems(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch uploads:", err);
        setLoading(false);
      });
  }, [user]);

  const handleDelete = (itemId) => {
    if (!window.confirm("Delete this item?")) return;

    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/delete-item", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Deleted successfully");
        setItems((prev) => prev.filter((item) => item.itemId !== itemId));
      })
      .catch((err) => {
        console.error("❌ Delete failed:", err);
        alert("❌ Delete failed");
      });
  };

  return (
    <div className="search-page">
      <h1 className="search-title">📦 My Uploaded Items</h1>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No uploads yet.</p>
      ) : (
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
                <p className="timestamp">{new Date(item.timestamp).toLocaleString()}</p>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item.itemId)}
                  style={{ backgroundColor: "red", color: "white", marginTop: "10px" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyUploads;
