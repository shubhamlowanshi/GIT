import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CgMathPlus, CgMathMinus } from 'react-icons/cg';
import './Cart.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = ({ cartItems = [], onAddToCart, onRemoveFromCart, onDeleteItem, refreshCart }) => {
  const parsePrice = (price) => parseInt(price.toString().replace(/[\u20B9,]/g, ''));

  const total = cartItems.reduce((acc, item) => acc + parsePrice(item.price) * item.qty, 0);
  const tax = total * 0.05;
  const grandTotal = total + tax;

  const navigate = useNavigate();
  // const [cartItems, setCartItems] = useState([]);

const fetchCartItems = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/cart');
    setCartItems(response.data); // Update state with fresh cart items
  } catch (err) {
    console.error('Failed to fetch cart:', err);
  }
};




 
  useEffect(() => {
    const shouldRefresh = localStorage.getItem('cartNeedsRefresh');
    if (shouldRefresh === 'true') {
      refreshCart(); // calls backend to get updated cart
      localStorage.removeItem('cartNeedsRefresh');
    }
  }, []);
  

  return (
    <>
      <div style={{ paddingTop: '75px' }}>
      <div style={{ backgroundColor: '#E3BE84', color: 'white', fontSize: '40px', padding: '15px' }}>
        Your Cart
      </div>
      <div className="cart-wrapper">
        <div className="cart-left">
          <h2>Your Cart Items</h2>
          {cartItems.length === 0 ? (
            <p style={{ padding: '20px' }}>Your cart is empty.</p>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Action</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td><img src={item.imageUrl} alt={item.cat} className="cart-img" /></td>
                    <td><strong>{item.name}</strong></td>
                    <td>
                      <button onClick={() => item.qty > 1 && onRemoveFromCart(item)} style={{ marginRight: '8px', border: 'none', backgroundColor: "#E3BE84" }}><CgMathMinus /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => onAddToCart(item)} style={{ marginLeft: '8px', border: 'none', backgroundColor: "#E3BE84" }}><CgMathPlus /></button>
                    </td>
                    <td>₹{(parsePrice(item.price) * item.qty).toLocaleString()}</td>
                    <td><button className="delete-btn" onClick={() => onDeleteItem(item)}>DELETE</button></td>
                    <td>
                      <button
                        className="checkout-btn"
                        onClick={() => navigate(`/update-product/${item._id}`, { state: item })}
                      >
                        UPDATE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="cart-right">
          <h2>Your Total</h2>
          <div className="total-card">
            <p>Total : <strong>₹{total.toLocaleString()}</strong></p>
            <p>Tax : <strong>₹{tax.toFixed(2)}</strong></p>
            <p>Grand Total : <strong>₹{grandTotal.toLocaleString()}</strong></p>
          </div>
          <div className="action-buttons">
            <button
              className="checkout-btn"
              onClick={() => {
                if (cartItems.length === 0) toast.warn('Please add something to cart first!');
                else navigate('/checkout');
              }}
            >
              CHECKOUT
            </button>
            <Link to="/mens">
              <button className="shopmore-btn">SHOP MORE</button>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />

      </div>
    </>
  );
};

export default Cart;
