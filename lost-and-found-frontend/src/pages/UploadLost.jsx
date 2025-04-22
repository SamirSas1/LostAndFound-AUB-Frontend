import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmailFromToken } from '../utils/tokenUtils';
import '../styles/UploadLost.css';

const UploadLost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    date: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    document.getElementById('imageInput').value = '';
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("idToken");
      if (!token) {
        alert("No token found. Please log in.");
        navigate("/login");
        return;
      }

      // ✅ Parse token manually if getEmailFromToken is unreliable
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.email || payload["cognito:username"];
      console.log("📧 Email from token:", email);

      if (!email) {
        alert("Invalid token. Please log in.");
        navigate("/login");
        return;
      }

      const payloadToSend = {
        title: formData.itemName,
        description: formData.description,
        email,
      };

      if (formData.image) {
        payloadToSend.image = await toBase64(formData.image);
      }

      const response = await fetch(
        'https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/upload-lost-item',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payloadToSend)
        }
      );

      const result = await response.json();
      console.log('✅ Upload result:', result);

      if (response.ok) {
        // ✅ Index in OpenSearch
        await fetch(
          "https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/index-lostfound-opensearch",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: formData.itemName,
              description: formData.description,
              timestamp: new Date(formData.date).toISOString(),
              isVerified: false
            })
          }
        );

        alert("✅ Lost item uploaded (pending verification).");
        navigate('/my-items');
      } else {
        alert("❌ Upload failed: " + result.error);
      }

    } catch (err) {
      console.error("🔥 Unexpected error during submission:", err);
      alert("You were logged out or something went wrong.");
      navigate("/login");
    }
  };

  return (
    <div className="upload-lost-container">
      <p className="upload-note">
  Upload the item you lost. You’ll receive an email if a match is found — but this email may not always be accurate. Please check verified found items in the <strong>Search</strong> section and visit the <strong>Lost and Found office</strong> to inquire about unverifiable ones.
</p>

      <form className="upload-lost-form" onSubmit={handleSubmit}>
        <h2>Upload Lost Item</h2>

        <input
          type="text"
          name="itemName"
          placeholder="Item Name"
          value={formData.itemName}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Item Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {formData.image && (
          <div className="image-preview-actions">
            <p>Selected: {formData.image.name}</p>
            <button
              type="button"
              className="remove-image-btn"
              onClick={handleImageRemove}
            >
              Remove Image
            </button>
          </div>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadLost;
