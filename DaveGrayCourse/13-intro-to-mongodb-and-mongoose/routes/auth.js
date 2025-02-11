const express = require("express");
const router = express.Router();
const { handleLogin } = require("../controllers/authController");

// POST is preferred for LOGIN to protect sensitive information in the request body
// GET is unsuitable for login because it could expose credentials in the URL, browser history, or logs
router.post("/", handleLogin);

module.exports = router;
