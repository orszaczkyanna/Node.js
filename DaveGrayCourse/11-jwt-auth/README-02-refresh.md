# Refresh Token Controller and Route

## server.js:

```javascript
const cookieParser = require("cookie-parser");
// ...
app.use(cookieParser());
// ...
app.use("/refresh", require("./routes/refresh"));
```

## routes/refresh.js:

```javascript
const express = require("express");
const router = express.Router();
const { handleRefreshToken } = require("../controllers/refreshTokenController");

// GET is appropriate for retrieving a new refresh token
router.get("/", handleRefreshToken);

module.exports = router;
```

## controllers/refreshTokenController.js:

```javascript
const jwt = require("jsonwebtoken");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  // Ensure the request includes cookies
  console.log("Received cookie:", cookies.jwt);
  if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

  const refreshToken = cookies.jwt;

  // Check if the refresh token exists in the database
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403); // Forbidden

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }
    // Generate a new access token (short-lived)
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" } // (5-15 min in production)
    );
    res.json(accessToken);
  });
};

module.exports = { handleRefreshToken };
```
