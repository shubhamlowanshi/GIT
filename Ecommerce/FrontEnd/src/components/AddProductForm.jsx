import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
const AddProductForm = () => {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    price: '',
    imageUrl: '',
    category: 'men',
    description: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setForm(prev => ({ ...prev, imageUrl: reader.result }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/products', form);

      toast.success(`✅ Product added!`);
      navigate('/home')
      setForm({ name: '', price: '', imageUrl: '', category: 'men', description: '' });
    } catch (err) {

      console.error(err);
      alert('❌ Failed to add product');
    }
  };

  return (
    <>
  <div style={{ paddingTop: '75px' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center' }}>Add New Product</h2>

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          required
          style={{ padding: '5px' }}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px' }}
        />

        <button
          type="submit"
          style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Add Product
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </div>
    </>

  );
};

export default AddProductForm;
