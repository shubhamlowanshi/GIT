import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Checkout.css';
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

const Checkout = ({ cartItems = [], clearCart }) => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    hno: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    mobile: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const parsePrice = (price) => parseInt(price.toString().replace(/[₹,]/g, ''));
  const total = cartItems.reduce((acc, item) => acc + parsePrice(item.price) * item.qty, 0);
  const tax = total * 0.05;
  const grandTotal = total + tax;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const triggerRazorpay = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Failed to load Razorpay SDK.');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?._id;

    try {
      const orderResponse = await fetch('http://localhost:3000/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) {
        toast.error(orderData.message || 'Failed to create Razorpay order.');
        return;
      }

      const options = {
        key: razorpayKey, // Replace with your Razorpay key
        amount: orderData.amount,
        currency: 'INR',
        name: 'Your Shop',
        description: 'Order Payment',
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch('http://localhost:3000/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user: userId,
              address,
              cartItems,
              paymentMethod: 'card',
              total,
              tax,
              grandTotal,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            clearCart();
            toast.success('Payment Successful!');
            navigate('/paymentsuccess');
          } else {
            toast.error(verifyData.message || 'Payment verification failed.');
          }
        },
        prefill: {
          name: storedUser?.username || '',
          email: storedUser?.email || '',
          contact: address.mobile,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Razorpay error: ' + err.message);
    }
  };

  const handlePayNow = async () => {
    const newErrors = {};
    for (const field in address) {
      if (!address[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});


    // if (paymentMethod === 'cod') {
    //   toast.success("Order placed successfully");
    //   clearCart();
    //   navigate('/PaymentSuccess');
    // }


    if (paymentMethod === 'card') {
      triggerRazorpay();
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?._id;

      if (!userId) {
        toast.error("User not logged in. Please log in to place an order.");
        return;
      }

      const orderData = {
        user: userId,
        address,
        paymentMethod,
        cartItems,
        total,
        tax,
        grandTotal,
      };

      try {
        const response = await fetch('http://localhost:3000/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();
        if (response.ok) {
          clearCart();
          toast.success("Order placed successfully");
          navigate('/payment-success');
        } else {
          toast.warn(result.message || 'Order failed. Please try again.');
        }
      } catch (error) {
        toast.error('Something went wrong while placing the order.');
      }
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile' && /[^0-9]/.test(value)) return;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const newErrors = { ...errors };

    if (!address[name].trim()) {
      newErrors[name] = 'This field is required';
    } else {
      delete newErrors[name];
    }

    if (name === 'mobile' && !/^\d{10}$/.test(address[name])) {
      newErrors.mobile = 'Invalid mobile number';
    }

    setErrors(newErrors);
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);

  };

  return (
    <>
      <div style={{ paddingTop: '75px' }}>
      <div style={{ backgroundColor: '#E3BE84', color: 'white', fontSize: '40px', padding: '15px' }}>
        Billing address
      </div>
      <div style={{ height: '600px' }}>
        <div className="checkout-container">
          <div className="checkout-left">
            <div className="billing-address">
              <h3>Billing Address</h3>
              <div className="address-card">
                {[
                  { name: 'hno', placeholder: 'House Number' },
                  { name: 'street', placeholder: 'Street' },
                  { name: 'landmark', placeholder: 'Landmark' },
                  { name: 'city', placeholder: 'City' },
                  { name: 'state', placeholder: 'State' },
                  { name: 'country', placeholder: 'Country' },
                  { name: 'pinCode', placeholder: 'Pin Code' },
                  { name: 'mobile', placeholder: 'Mobile Number', maxLength: 10 },
                ].map(({ name, placeholder, maxLength }) => (
                  <div key={name}>
                    <input
                      type="text"
                      name={name}
                      maxLength={maxLength}
                      value={address[name]}
                      onChange={handleAddressChange}
                      onBlur={handleBlur}
                      placeholder={placeholder}
                      className={`input-field ${errors[name] ? 'input-error' : ''}`}
                    />
                    {errors[name] && <span className="error-message">{errors[name]}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="payment-details">
              <h3>Payment Details</h3>
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={handlePaymentChange}
                />
                Cash on Delivery
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={handlePaymentChange}
                />
                Credit Card Payment
              </label>
            </div>
          </div>

          <div className="checkout-right">
            <div className="cart-summary">
              <h3>Your Cart</h3>
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.imageUrl} alt={item.cat} />
                  <div className="item-details">
                    <p>{item.name}</p>
                    <p>₹{parsePrice(item.price).toLocaleString()}</p>
                    <p>Qty: {item.qty}</p>
                  </div>
                </div>
              ))}
              <div className="price-summary">
                <p>Total: <strong>₹{total.toLocaleString()}</strong></p>
                <p>Tax: <strong>₹{tax.toFixed(2)}</strong></p>
                <p>Grand Total: <strong>₹{grandTotal.toLocaleString()}</strong></p>
              </div>
              <button className="pay-now-btn" onClick={handlePayNow}>
                Pay Now ₹{grandTotal.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
     
    </>
  );
};

export default Checkout;
