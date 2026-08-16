const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

exports.sendOrderNotification = async (order) => {
    if (!BOT_TOKEN || !CHAT_ID) {
        console.log('Telegram not configured');
        return;
    }

    const itemsList = (order.item || []).map(i => {
        const tier = i.variantLabel || i.packagingTier || ''
        const tierStr = tier ? ` — *${tier}*` : ''
        return `• ${i.product?.title || 'Product'}${tierStr} × ${i.quantity || 1}`
    }).join('\n');

    const address = order.address?.[0] || {};
    
    const email = (order.guestEmail || '').trim() || 'N/A';
    const phone = (order.guestPhone || '').trim() 
               || (address.phoneNumber || '').trim() 
               || 'N/A';

    const message = `
🛒 *NEW ORDER PLACED!*

📦 Order ID: \`${order._id}\`
💰 Total: ₹${order.total}
💳 Payment: ${order.paymentMode}
📍 Address: ${address.city || ''}, ${address.state || ''}

*Items:*
${itemsList || 'No items'}

👤 Customer: ${order.user ? 'Registered' : 'Guest'}
📧 ${email}
📞 ${phone}
    `.trim();

    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        console.log('✅ Telegram notification sent');
    } catch (err) {
        console.error('❌ Telegram failed:', err.response?.data || err.message);
    }
};