import React, { useEffect, useState } from "react";
import "../styles/Search.css"; // You can create StaffDashboard.css if you want to customize

const StaffDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cooldowns, setCooldowns] = useState({}); // ✅ cooldown state

  useEffect(() => {
    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/get-all-items-for-staff")
      .then((res) => res.json())
      .then((data) => {
        const parsedItems = Array.isArray(data) ? data : JSON.parse(data.body);
        setItems(parsedItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch staff items:", err);
        setLoading(false);
      });
  }, []);
  const handleDelete = (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
  
    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/delete-item", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        return res.json();
      })
      .then(() => {
        alert("🗑 Item deleted successfully");
        setItems((prev) => prev.filter((item) => item.itemId !== itemId));
      })
      .catch((err) => {
        console.error("❌ Delete failed:", err);
        alert("❌ Failed to delete item.");
      });
  };
  

  const handleNotify = (itemId) => {
    const item = items.find((i) => i.itemId === itemId);
  
    if (!item) {
      alert("❌ Item not found");
      return;
    }
  
    fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/notify-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: item.itemId,
        userEmail: item.userEmail,
        title: item.title,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("✅ Notification sent to student!");
        startCooldown(itemId); // ✅ start cooldown after success
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
      <h1 className="search-title">All Uploaded Items (Staff View)</h1>
      {loading ? (
        <p>Loading items...</p>
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
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Posted By:</strong> {item.userEmail}</p>
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
    style={{ marginLeft: "10px", backgroundColor: "#ff4d4f", color: "white" }}
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
