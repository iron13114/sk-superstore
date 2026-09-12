const express = require("express");
const router = express.Router();
const { getAll, getTree } = require("../controllers/Category");

router.get("/", getAll);
router.get("/tree", getTree);   

module.exports = router;