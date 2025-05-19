import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaRegUser } from "react-icons/fa";
import "./Homepage.css";
import { useState, useEffect } from 'react';

import logo from '../assets/logos.png';
import { HiOutlineLogout } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Navbars = ({ isAuthenticated, setIsAuthenticated, cartItems, profileImage }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, [isAuthenticated]);
  const handleLogout = () => {
    toast.success("You have been logged out successfully!");
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.clear();
    setTimeout(() => {
      navigate("/login");
    }, 1000);

  };



  const getTotalCartItems = () => {
    if (Array.isArray(cartItems)) {
      return cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);
    }
    return 0;
  };

  return (
    <>
      <Navbar fixed="top" expand="lg" className="bg-body-tertiary navbar">
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} to="/">
            <img src={logo} height={50} width={80} alt="Logo" />
            
          </Navbar.Brand>


          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            <Nav className="me-auto">
              {isAuthenticated && (
                <>
                  <Nav.Link as={Link} to="/mens" style={{ color: 'white' }}>Men's Wear</Nav.Link>
                  <Nav.Link as={Link} to="/womens" style={{ color: 'white' }}>Women's Wear</Nav.Link>
                  <Nav.Link as={Link} to="/kids" style={{ color: 'white' }}>Kid's Wear</Nav.Link>
                  <Nav.Link as={Link} to="/cart" style={{ color: 'white' }}>
                    cart ({getTotalCartItems()})
                  </Nav.Link>
                  <Nav.Link as={Link} to="/AddProductForm" style={{ color: 'white' }}>Upload</Nav.Link>
                  <Nav.Link as={Link} to="/Orderhistory" style={{ color: 'white' }}>order History</Nav.Link>
                </>
              )}
            </Nav>


            <Nav className="ml-auto">
              {!isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/login" style={{ color: 'white' }}>Login</Nav.Link>
                  <Nav.Link as={Link} to="/register" style={{ color: 'white' }}>Register</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/profile" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {profileImage && (
                      <img src={profileImage} alt="Profile" style={{ height: '30px', width: '30px', borderRadius: '100%' }} />
                    )}
                    <span className="font-semibold">{user.username}</span>
                  </Nav.Link>

                  <Nav.Link onClick={handleLogout} style={{ color: 'white', cursor: 'pointer' }}>
                    <HiOutlineLogout style={{ marginTop: '6px' }} />

                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ToastContainer position="top-right" />
    </>
  );
};

export default Navbars;
