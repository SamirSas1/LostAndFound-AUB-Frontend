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
      <h1 className="search-title">My Uploaded Items</h1>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No uploads yet.</p>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <div key={item.itemId} className="item-card">
              {item.imageUrl ? (
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
              ) : (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                  alt="No image available"
                  className="no-image-placeholder"
                />
              )}
              <div className="info">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <p className="timestamp">
                  {(() => {
                    const utcDate = new Date(item.timestamp); // raw UTC
                    const beirutDate = new Date(utcDate.getTime() + 3 * 60 * 60 * 1000); // add 3 hours
                    return beirutDate.toLocaleString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    });
                  })()}
                </p>
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

export default MyUploads;
