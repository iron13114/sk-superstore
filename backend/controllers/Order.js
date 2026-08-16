const Order = require("../models/Order");
const { sendOrderConfirmationEmail } = require('../utils/Emails');
const { sendOrderNotification } = require('../utils/telegram');

exports.create = async (req, res) => {
    try {
        const orderData = { ...req.body };
        
        if (!orderData.user || orderData.user === 'null' || orderData.user === '') {
            delete orderData.user;
        }
        
        if (orderData.address && !Array.isArray(orderData.address)) {
            orderData.address = [orderData.address];
        }
        if (orderData.item && !Array.isArray(orderData.item)) {
            orderData.item = [orderData.item];
        }

        const created = new Order(orderData);
        await created.save();

        try {
            await sendOrderNotification(created);
        } catch (notifyErr) {
            console.error('Telegram notification failed:', notifyErr.message);
        }

        res.status(201).json(created);
    } catch (error) {
        console.error("Order Creation Error:", error);
        return res.status(400).json({
            message: 'Error creating an order',
            error: error.message 
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Get Order Error:", error);
        return res.status(500).json({ message: 'Error fetching order' });
    }
};

exports.getByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await Order.find({ user: id });
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error fetching orders, please trying again later' });
    }
};

exports.getAll = async (req, res) => {
    try {
        let skip = 0;
        let limit = 0;

        if (req.query.page && req.query.limit) {
            const pageSize = req.query.limit;
            const page = req.query.page;
            skip = pageSize * (page - 1);
            limit = pageSize;
        }

        const totalDocs = await Order.find({}).countDocuments().exec();
        const results = await Order.find({}).skip(skip).limit(limit).exec();

        res.header("X-Total-Count", totalDocs);
        res.status(200).json(results);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching orders, please try again later' });
    }
};

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Order.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating order, please try again later' });
    }
};