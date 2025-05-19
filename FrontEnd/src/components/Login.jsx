import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setIsAuthenticated, setUsername }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Login failed');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // toast.success('Login successful!');

    setIsAuthenticated(true);
    setUsername(data.user.name);

    // Delay navigation to allow toast to show
    setTimeout(() => {
      navigate('/');
    }, 2000); // 2-second delay

  } catch (err) {
    toast.warn('Wrong password!');
    setError('Something went wrong. Please try again.');
    console.error(err);
  }
};



  return (
    <>
      <div style={{ paddingTop: '75px' }}>
      <div style={{ backgroundColor: '#E3BE84', color: 'white', fontSize: '40px', padding: '15px' }}>
        Login User
      </div>

      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Login</h2>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

           
            {error && <p className="error-text">{error}</p>}

        
            <button type="submit" className="login-button">LOGIN</button>
          </form>

          <p className="register-text">
            New To Brains Kart? <Link to="/register" className="register-link">Register</Link>
          </p>

          <div className="logo">BRAINSKART</div>
        </div>
      </div>
       {/* <ToastContainer position="top-right" /> */}
       </div>
    </>
  );
};

export default Login;