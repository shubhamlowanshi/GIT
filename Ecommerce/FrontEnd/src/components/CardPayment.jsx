import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PaypalButton = ({ amount, onSuccess }) => {
  return (
    <PayPalScriptProvider options={{ 'client-id': 'https://api-m.sandbox.paypal.com/v1/oauth2/token', currency: 'INR' }}>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={async () => {
          const res = await fetch('http://localhost:3000/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }),
          });
          const data = await res.json();
          return data.id;
        }}
        onApprove={async (data) => {
          const res = await fetch(`http://localhost:3000/api/paypal/capture-order/${data.orderID}`, {
            method: 'POST',
          });
          const paymentData = await res.json();
          alert('Payment Successful via PayPal!');
          onSuccess(); // e.g., clear cart, navigate
        }}
        onError={(err) => {
          console.error(err);
          alert('PayPal payment failed');
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
