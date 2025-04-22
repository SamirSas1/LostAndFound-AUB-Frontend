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
      const email = getEmailFromToken();
      if (!email) {
        alert("You must be logged in to upload a lost item.");
        navigate("/login");
        return;
      }

      const payload = {
        title: formData.itemName,
        description: formData.description,
        email,
      };

      if (formData.image) {
        payload.image = await toBase64(formData.image);
      }

      const token = localStorage.getItem("idToken");

      const response = await fetch(
        'https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/upload-lost-item',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await response.json();
      console.log('✅ Upload result:', result);

      if (response.ok) {
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
        navigate('/my-uploads');
      } else {
        alert("❌ Upload failed: " + result.error);
      }
    } catch (err) {
      console.error("🔥 Unexpected error during submission:", err);
      alert("Something went wrong. Please log in again.");
      navigate("/login");
    }
  };

  return (
    <div className="upload-lost-container">
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