import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateProduct.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProduct = () => {
  const { state } = useLocation(); // Product passed via Link state
  const [product, setProduct] = useState(state);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      await axios.put(`http://localhost:3000/api/uploads/${product._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/mens', { replace: true }); // 👈 Redirect to mens page

    } catch (err) {
      toast.warn('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-form-container">
      <form className="update-form" onSubmit={handleSubmit}>
        <h2>Update Product</h2>

        <label>Product Name</label>
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />

        <label>Price (₹)</label>
        <input
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Enter price"
          required
        />

        <label>Upload New Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {newImage && (
          <div className="image-preview">
            <p>Image Preview:</p>
            <img src={URL.createObjectURL(newImage)} alt="Preview" />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>

 
    </div>
  );
};

export default UpdateProduct;
