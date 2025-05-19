import React from 'react';

const OrderSuccess = ({ order, username }) => {
  if (!order) return null;


  const formattedDate = new Date(order.date).toLocaleString();


  const totalQuantity = order.products.reduce((total, product) => total + product.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-green-300">
      <h2 className="text-2xl font-semibold text-green-600 mb-4">🎉 Order Placed Successfully!</h2>
      <p className="text-gray-600 mb-2">Order Date and Time: <span className="font-medium">{formattedDate}</span></p>

      <div className="mb-4">
        <p className="text-gray-600 mb-2">Customer: <span className="font-medium">{username}</span></p>
        <p className="text-gray-600 mb-2">Total Quantity: <span className="font-medium">{totalQuantity}</span></p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Product Details:</h3>
        <ul className="space-y-3">
          {order.products.map((product, idx) => (
            <li key={idx} className="flex items-center gap-4 border-b pb-2">
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md border" />
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">Price: ₹{product.price}</p>
                <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderSuccess;
