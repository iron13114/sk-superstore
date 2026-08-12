
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendOrderConfirmationEmail = async (email, order) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Order Confirmation #${order._id}`,
        html: `
            <h2>Thank you for your order!</h2>
            <p>Order ID: <strong>${order._id}</strong></p>
            <p>Total: ₹${order.total}</p>
            <p>Status: ${order.status}</p>
            <p>You can track your order at: 
               <a href="${process.env.ORIGIN}/track-order/${order._id}">
                   Track Order
               </a>
            </p>
        `
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmationEmail, /* your other exports */ };

exports.sendMail = async(receiverEmail,subject,body) => {
    await transporter.sendMail({
    from: process.env.EMAIL,
    to: receiverEmail,
    subject: subject,
    html: body
  });
};
