const express = require("express");
const router = express.Router();
const { handleLogout } = require("../controllers/logoutController");

// POST is used for LOGOUT because it modifies the server state by deleting the refresh token.
// GET is unsuitable for logout as it should not alter server state or be cached.
// PUT is not suitable as it is typically used to fully replace or update a resource, not to perform actions.
router.post("/", handleLogout);

module.exports = router;
