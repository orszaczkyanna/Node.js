const express = require("express");
const router = express.Router();
const { handleRefreshToken } = require("../controllers/refreshTokenController");

// GET is appropriate for retrieving a new refresh token because it does not modify server data
// GET is used here instead of POST because the refresh token is only being retrieved, not sent in the body
router.get("/", handleRefreshToken);

module.exports = router;
