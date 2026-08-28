const Product = require("../models/Product");

exports.create = async (req, res) => {
  try {
    const created = new Product(req.body);
    await created.save();
    res.status(201).json(created);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding product, please trying again later" });
  }
};

exports.getAll = async (req, res) => {
    try {
        const filter = {};
        const sort = {};
        let skip = 0;
        let limit = 0;

        // DEBUG: see exactly what the frontend is sending
        console.log('>>> QUERY PARAMS:', req.query);

        // SEARCH — support both 'q' (SearchPage) and 'search' (ProductList)
        const searchTerm = req.query.q || req.query.search;
        if (searchTerm && searchTerm !== "undefined") {
            filter.title = { $regex: searchTerm, $options: "i" };
        }

        // BRAND
        if (req.query.brand && req.query.brand !== "undefined") {
            const brands = Array.isArray(req.query.brand) ? req.query.brand : [req.query.brand];
            filter.brand = { $in: brands };
        }

        // CATEGORY
        if (req.query.category && req.query.category !== "undefined") {
            const categories = Array.isArray(req.query.category) ? req.query.category : [req.query.category];
            filter.category = { $in: categories };
        }

        // PACKAGING TIER — query inside the tiers array
        const tierParam = req.query.pack || req.query.packagingTier;
        if (tierParam && tierParam !== "undefined") {
            filter['tiers.type'] = tierParam;   
        }

        // IN STOCK ONLY
        if (req.query.inStock === "true" || req.query.inStock === true) {
            filter.stockQuantity = { $gt: 0 };
        }

        // SOFT-DELETE FILTER
        if (req.query.user) {
            filter.isDeleted = { $ne: true };
        } else if (req.query.includeDeleted !== "true") {
            filter.isDeleted = { $ne: true };
        }

        // SORT
        const sortParam = req.query.sort;
        if (sortParam && sortParam !== "undefined") {
            if (sortParam === "price-low") {
                sort.price = 1;
            } else if (sortParam === "price-high") {
                sort.price = -1;
            } else if (sortParam === "stock") {
                sort.stockQuantity = -1;
            } else if (sortParam === "relevance") {
                sort.createdAt = -1;
            } else {
                const order = req.query.order && req.query.order !== "undefined" ? req.query.order : "asc";
                sort[sortParam] = order === "asc" ? 1 : -1;
            }
        } else {
            sort.createdAt = -1;
        }

        // PAGINATION
        let page = 1;
        let pageSize = 12;

        if (req.query.pagination) {
            try {
                const pagination = typeof req.query.pagination === "string" ? JSON.parse(req.query.pagination) : req.query.pagination;
                page = parseInt(pagination.page, 10) || 1;
                pageSize = parseInt(pagination.limit, 10) || 12;
            } catch (e) {
                console.log("Pagination parse error", e);
            }
        } else if (req.query.page && req.query.limit) {
            page = parseInt(req.query.page, 10) || 1;
            pageSize = parseInt(req.query.limit, 10) || 12;
        }

        if (pageSize > 0) {
            skip = pageSize * (page - 1);
            limit = pageSize;
        }

        console.log('>>> FILTER:', filter);
        console.log('>>> SORT:', sort);

        const totalDocs = await Product.countDocuments(filter).exec();
        const results = await Product.find(filter)
            .sort(sort)
            .populate("brand")
            .populate("category")
            .skip(skip)
            .limit(limit)
            .exec();

        res.set("X-Total-Count", totalDocs);
        res.status(200).json(results);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching products, please try again later" });
    }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findById(id).populate("brand").populate("category");
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting product details, please try again later" });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating product, please try again later" });
  }
};

exports.undeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const unDeleted = await Product.findByIdAndUpdate(id, { isDeleted: false }, { new: true }).populate("brand");
    res.status(200).json(unDeleted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error restoring product, please try again later" });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).populate("brand");
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting product, please try again later" });
  }
};