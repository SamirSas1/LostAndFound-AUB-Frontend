import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UploadLost.css';

const UploadFound = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    date: '',
    isVerified: 'true',
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
        alert("You must be logged in to upload a found item.");
        navigate("/login");
        return;
      }

      // ✅ Decode token manually (fallback if getEmailFromToken fails)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.email || payload["cognito:username"];
      console.log("📧 Email from token:", email);

      if (!email) {
        alert("You must be logged in to upload a found item.");
        navigate("/login");
        return;
      }

      if (!formData.image) {
        alert("Please select an image.");
        return;
      }

      const base64Image = await toBase64(formData.image);

      const payloadToSend = {
        title: formData.itemName,
        description: formData.description,
        email: email,
        image: base64Image,
        isVerified: formData.isVerified === 'true',
      };

      const response = await fetch('https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/upload-found-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payloadToSend),
      });

      const result = await response.json();
      console.log('✅ Upload result:', result);

      if (response.ok) {
        await fetch("https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/index-lostfound-opensearch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: formData.itemName,
            description: formData.description,
            timestamp: new Date(formData.date).toISOString(),
            isVerified: formData.isVerified === 'true'
          })
        });

        alert("✅ Found item uploaded and indexed.");
        navigate('/my-items');
      } else {
        alert("❌ Upload failed: " + result.error);
      }

    } catch (error) {
      console.error("🔥 Upload error:", error);
      alert("Something went wrong. Please try again.");
      navigate("/login");
    }
  };

  return (
    <div className="upload-lost-container">
      <form className="upload-lost-form" onSubmit={handleSubmit}>
        <h2>Upload Found Item</h2>

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

        <select
          name="isVerified"
          className="select-container"
          value={formData.isVerified}
          onChange={handleChange}
          required
        >
          <option value="true">Verifiable</option>
          <option value="false">Not Verifiable</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadFound;
