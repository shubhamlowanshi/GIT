import React from "react";
import { loadRazorpayScript } from "../components/loadRazorPayScript";

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

const PaymentButton = ({ amount, user }) => {
  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    // Create order from backend
    const orderResponse = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        receipt: "receipt#1",
      }),
    });

    const orderData = await orderResponse.json();

    const options = {
      key: razorpayKey,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "My Store",
      description: "Test Transaction",
      order_id: orderData.id,
      // handler: async function (response) {
      //   // Verify payment
      //   const verifyRes = await fetch("/api/payment/verify", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(response),
      //   });

      //   const verifyData = await verifyRes.json();
      //   alert(verifyData.message);
      // },
      prefill: {
        name: "mayank",
        email: "m@gmail.com",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePayment}>Pay ₹{amount}</button>;
};

export default PaymentButton;
