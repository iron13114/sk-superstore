const Cart = require('../models/Cart')

exports.create = async (req, res) => {
    try {
        const { user, product, packagingTier, quantity } = req.body;
        
        // Check if this exact product + tier already exists for the user
        const existing = await Cart.findOne({ 
            user, 
            product, 
            packagingTier: packagingTier || 'single' 
        });
        
        let result;
        if (existing) {
            // Increment quantity of existing cart item
            existing.quantity += (quantity || 1);
            await existing.save();
            result = await existing.populate({ path: "product", populate: { path: "brand" } });
        } else {
            // Create new cart item
            result = await new Cart(req.body).save();
            await result.populate({ path: "product", populate: { path: "brand" } });
        }
        
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error adding product to cart, please try again later' });
    }
}

exports.getByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Cart.find({ user: id }).populate({ path: "product", populate: { path: "brand" } });
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error fetching cart items, please try again later' });
    }
}

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Cart.findByIdAndUpdate(id, req.body, { new: true }).populate({ path: "product", populate: { path: "brand" } });
        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error updating cart items, please try again later' });
    }
}

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Cart.findByIdAndDelete(id);
        res.status(200).json(deleted);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error deleting cart item, please try again later' });
    }
}

exports.deleteByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        await Cart.deleteMany({ user: id });
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Some Error occurred while resetting your cart" });
    }
}