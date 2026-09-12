const Category = require("../models/Category");

exports.getAll = async (req, res) => {
    try {
        const result = await Category.find({}).lean();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching categories" });
    }
};

exports.getTree = async (req, res) => {
    try {
        const result = await Category
            .find({ parent: null })
            .populate({ path: "children", options: { sort: { order: 1, name: 1 } } })
            .sort({ order: 1, name: 1 })
            .lean();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching category tree" });
    }
};