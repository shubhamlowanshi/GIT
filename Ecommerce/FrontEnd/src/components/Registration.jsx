import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Registration.css';

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const { username, email, phone, address, password, confirmPassword } = formData;

    if (!username || !email || !phone || !address || !password || !confirmPassword) {
      return 'Please fill all fields';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }

    if (!/^\d{10}$/.test(phone)) {
      return 'Phone number must be exactly 10 digits';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === 'phone') {
      val = val.replace(/\D/g, ''); // remove non-digits
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      toast.success(`Registration successful`);
      navigate('/login');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    }
  };

  return (
    <>
      <div style={{ backgroundColor: '#E3BE84', color: 'white', fontSize: '40px', padding: '15px' }}>
        Registration Form
      </div>
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">User Registration</h2>

          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            className="login-input"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="login-input"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="login-input"
            value={formData.phone}
            maxLength="10"
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            className="login-input"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-input"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="login-input"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {error && <p className="error-text">{error}</p>}

          <button className="login-button" onClick={handleSubmit}>Register</button>

          <div className="logo">BRAINSKART</div>
          <p className="register-text">
            Already have an account? <Link to='/login' className="register-link">Login</Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default Registration;
