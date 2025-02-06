const express = require("express");
const router = express.Router();
const { handleNewUser } = require("../controllers/registerController");

// POST: Add new data (Create)
router.post("/", handleNewUser);

module.exports = router;
