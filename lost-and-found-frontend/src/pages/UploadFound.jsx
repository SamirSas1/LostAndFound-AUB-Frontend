import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UploadLost.css'; // same styling as UploadLost

const UploadFound = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    date: '',
    image: null,
    verifiable: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, image: null });
    document.getElementById('imageInput').value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('itemName', formData.itemName);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('image', formData.image);
    data.append('verifiable', formData.verifiable);
    console.log('Submitting:', Object.fromEntries(data.entries()));
    // Send to backend
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

        <select          
          required
          class="select-container"
        >
          <option value="student">Verifiable</option>
          <option value="staff">Unverifiable</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadFound;
