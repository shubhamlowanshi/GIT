import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadRazorpayScript } from "./loadRazorPayScript";
import { toast } from "react-toastify";

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;


const CardPaymentForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const [errors, setErrors] = useState({});
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cartItems, address, userId, amount, clearCart } = state || {};

  if (!cartItems || !address || !userId) {
    toast.error("Invalid access to card payment page");
    navigate("/checkout");
    return null;
  }

  const validate = () => {
    const newErrors = {};
    const trimmedCard = cardNumber.replace(/\s/g, "");

    if (!/^\d{16}$/.test(trimmedCard)) {
      newErrors.cardNumber = "Enter a valid 16-digit card number";
    }

    if (!expiryMonth || !expiryYear) {
      newErrors.expiry = "Select a valid expiry month and year";
    }

    if (!/^\d{3}$/.test(cvc)) {
      newErrors.cvc = "CVC must be exactly 3 digits";
    }

    if (!cardHolder || cardHolder.length < 3 || /\d/.test(cardHolder)) {
      newErrors.cardHolder = "Enter a valid name without numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  // 1. Load Razorpay SDK
  const res = await loadRazorpayScript();
  if (!res) {
    toast.error("Razorpay SDK failed to load");
    return;
  }

  // 2. Create Razorpay order from backend
  const orderRes = await fetch("http://localhost:3000/api/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
   body: JSON.stringify({
  amount: amount * 100,
  currency: "INR",
  receipt: `receipt_${Date.now()}`,
}),

  });

  const orderData = await orderRes.json();

  // 3. Setup Razorpay options
  const options = {
    key:razorpayKey ,
    amount: orderData.amount,
    currency: orderData.currency,
    name: "My Store",
    description: "Product Purchase",
    order_id: orderData.id,
    handler: async function (response) {
      // 4. Verify payment
      const verifyRes = await fetch("http://localhost:3000/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        // 5. Save order in DB
        const order = {
          user: userId,
          address,
          paymentMethod: "razorpay",
          cartItems,
          total: amount,
          razorpayPaymentId: response.razorpay_payment_id,
        };

        const saveRes = await fetch("http://localhost:3000/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });

        if (saveRes.ok) {
          toast.success("Order placed successfully!");
          clearCart?.();
          navigate("/PaymentSuccess");
        } else {
          toast.error("Order failed");
        }
      } else {
        toast.error("Payment verification failed");
      }
    },
    prefill: {
      name: cardHolder,
      email: "customer@example.com", // optional
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};



  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));

  return (
    <div className="card-payment-container">
      <h2 style={{ color: "white" }}>Enter Card Details</h2>
      <form onSubmit={handleSubmit} className="card-form">
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (val.length <= 16) setCardNumber(val);
          }}
          className="input-field"
          inputMode="numeric"
          maxLength={16}
        />
        {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}

        <div className="card-row">
          <div style={{ flex: 1 }}>
            <select
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              className="input-field"
            >
              <option value="">MM</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <select
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
              className="input-field"
            >
              <option value="">YY</option>
              {years.map((year) => (
                <option key={year} value={year.toString().slice(-2)}>
                  {year.toString().slice(-2)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {errors.expiry && <p className="error-text">{errors.expiry}</p>}

        <input
          type="text"
          placeholder="CVC"
          value={cvc}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (val.length <= 3) setCvc(val);
          }}
          className="input-field"
          inputMode="numeric"
          maxLength={3}
        />
        {errors.cvc && <p className="error-text">{errors.cvc}</p>}

        <input
          type="text"
          placeholder="Cardholder Name"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          className="input-field"
        />
        {errors.cardHolder && <p className="error-text">{errors.cardHolder}</p>}

        <button type="submit" className="pay-btn">
          Continue & Place Order
        </button>
      </form>

      <style>{`
        .card-payment-container {
          max-width: 400px;
          margin: 40px auto;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .card-payment-container h2 {
          text-align: center;
          margin-bottom: 20px;
        }

        .card-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .input-field {
          padding: 12px 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
          width: 100%;
        }

        .input-field:focus {
          border-color: #007bff;
          outline: none;
        }

        .card-row {
          display: flex;
          gap: 10px;
        }

        .pay-btn {
          padding: 14px;
          background: #007bff;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s;
        }

        .pay-btn:hover {
          background: #0056b3;
        }

        .error-text {
          color: red;
          font-size: 13px;
          margin-top: -10px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default CardPaymentForm;
