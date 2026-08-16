const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

exports.sendOrderNotification = async (order) => {
    if (!BOT_TOKEN || !CHAT_ID) {
        console.log('Telegram not configured');
        return;
    }

    const itemsList = order.item.map(i => 
        `• ${i.product?.title || 'Product'} x${i.quantity}`
    ).join('\n');

    const message = `
🛒 *NEW ORDER PLACED!*

📦 Order ID: \`${order._id}\`
💰 Total: ₹${order.total}
💳 Payment: ${order.paymentMode}
📍 Address: ${order.address[0]?.city}, ${order.address[0]?.state}

*Items:*
${itemsList}

👤 Customer: ${order.user ? 'Registered' : 'Guest'}
📧 ${order.guestEmail || 'N/A'}
📞 ${order.guestPhone || order.address[0]?.phoneNumber || 'N/A'}
    `.trim();

    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        console.log('Telegram notification sent');
    } catch (err) {
        console.error('Telegram failed:', err.response?.data || err.message);
    }
};