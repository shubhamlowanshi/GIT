// server/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendOrderEmail = async (toEmail, cartItems, grandTotal) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  const itemsHtml = cartItems
    .map(
      (item) =>
        `<div>
          <h4>${item.name}</h4>
          <img src="${item.imageUrl}" alt="${item.name}" width="100" />
          <p>Price: ₹${item.price}</p>
          <p>Quantity: ${item.qty}</p>
        </div><hr/>`
    )
    .join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your Order Confirmation',
    html: `
      <h2>Thank you for your order!</h2>
      ${itemsHtml}
      <p><strong>Total Paid:</strong> ₹${grandTotal}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOrderEmail;
