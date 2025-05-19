import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#E3BE84',
      color: '#fff'
    }}>
      <h1 style={{ height: '100px' }}>🎉 Payment Successful! 🎉</h1>
      <p>Thank you for your purchase. Redirecting to homepage...</p>
    </div>
  );
};

export default PaymentSuccess;
