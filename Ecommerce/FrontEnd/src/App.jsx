import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./components/Homepage";
import MensCollection from "./components/MensCollection";
import Womens from "./components/Womens";
import Kids from "./components/Kids";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Navbars from "./components/Navbar";
import Checkout from "./components/Checkout";
import PaymentSuccess from "./components/PaymentSuccess";
import AddProductForm from "./components/AddProductForm";
import UserProfile from "./components/UserProfile";
import SupportBot from "./components/SupportBot";
import UpdateProduct from "./components/UpdateProduct";
import OrderHistory from "./components/OrderHistory";
import axios from "axios";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import CardPaymentForm from "./components/CardPaymentForm";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");

  // Read authentication & user on mount
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    const user = JSON.parse(localStorage.getItem("user"));
    if (auth && user) {
      setIsAuthenticated(true);
      setUsername(user.name || user.username || "User");
    }
    setLoading(false);
  }, []);

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/cart");
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Load cart on mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (item) => {
    const exist = cartItems.find((x) => x._id === item._id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x._id === item._id ? { ...x, qty: x.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  const handleRemoveFromCart = (item) => {
    const exist = cartItems.find((x) => x._id === item._id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x._id !== item._id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x._id === item._id ? { ...x, qty: x.qty - 1 } : x
        )
      );
    }
  };

  const handleDeleteItem = (item) => {
    // toast.success("Remove item from cart successfully");
    setCartItems(cartItems.filter((x) => x._id !== item._id));
  };

  const handleUpdateItem = (itemId, updatedData) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, ...updatedData } : item
      )
    );
  };

  const clearCartItems = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (loading) return null; // Wait until auth check finishes

  return (
    <Router>
      <Navbars
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        usernames={username}
        cartItems={cartItems}
        profileImage={profileImage}
        clearCartItems={clearCartItems}
      />

      <Routes>
        {!isAuthenticated ? (
          <>
            <Route
              path="/login"
              element={
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setUsername={setUsername}
                />
              }
            />
            <Route
              path="/register"
              element={
                <Registration
                  setIsAuthenticated={setIsAuthenticated}
                  setUsername={setUsername}
                />
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/mens"
              element={<MensCollection onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/womens"
              element={<Womens onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/kids"
              element={<Kids onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onDeleteItem={handleDeleteItem}
                  refreshCart={fetchCartItems}
                />
              }
            />
            <Route path="/update-product/:id" element={<UpdateProduct />} />
            <Route path="/AddProductForm" element={<AddProductForm />} />
            <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
            <Route
              path="/checkout"
              element={
                <Elements stripe={loadStripe("your_publishable_key_here")}>
                  <Checkout cartItems={cartItems} clearCart={clearCart} />
                </Elements>
              }
            />

            <Route path="/card-payment" element={<CardPaymentForm/>}/>
            <Route path="/profile" element={<UserProfile />} />
            {storedUser && (
              <Route
                path="/orderhistory"
                element={<OrderHistory userId={storedUser._id} />}
              />
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>

      {/* <ToastContainer position="top-right" /> */}
      {/* <SupportBot className="fixed bottom-4 right-4 z-50" /> */}
    </Router>
  );
}

export default App;
