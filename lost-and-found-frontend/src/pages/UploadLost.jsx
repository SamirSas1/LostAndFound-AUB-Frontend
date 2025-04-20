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
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, image: null });
    document.getElementById('imageInput').value = '';
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const email = getEmailFromToken();
      console.log("📧 Email from token:", email);

      if (!email) {
        alert("You must be logged in to upload a lost item.");
        navigate("/login");
        return;
      }

      if (!formData.image) {
        alert("Please select an image.");
        return;
      }

      const base64Image = await toBase64(formData.image);

      const payload = {
        title: formData.itemName,
        description: formData.description,
        email: email,
        image: base64Image
      };

      const token = localStorage.getItem("idToken");
      console.log("🔐 Using token for upload:", token);

      const response = await fetch('https://ieq3dmri5l.execute-api.eu-west-1.amazonaws.com/dev/upload-lost-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // ✅ Send the token to backend
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('✅ Upload result:', result);

      if (response.ok) {
        alert("Lost item uploaded successfully.");
        navigate('/my-uploads');
      } else {
        alert("Upload failed: " + result.error);
      }

    } catch (err) {
      console.error("🔥 Unexpected error during submission:", err);
      alert("You were logged out or something went wrong.");
      navigate("/login");
    }
  };

  return (
    <div className="upload-lost-container">
      <form className="upload-lost-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="close-button"
          onClick={() => navigate('/search-found')}
        >
          &times;
        </button>

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
          required={!formData.image}
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
