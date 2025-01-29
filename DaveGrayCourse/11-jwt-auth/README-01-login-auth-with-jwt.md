# Authentication with JWT (Login)

## server.js:

```javascript
require("dotenv").config();
// ...
const verifyJWT = require("./middleware/verifyJWT");
// ...
// Routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth")); // !! auth route

app.use(verifyJWT); // !! verifyJWT middleware
app.use("/employees", require("./routes/api/employees")); // API
// ...
```

## routes/auth.js

```javascript
const express = require("express");
const router = express.Router();
const { handleLogin } = require("../controllers/authController");

// POST is preferred for LOGIN to protect sensitive information in the request body
router.post("/", handleLogin);

module.exports = router;
```

## middleware/verifyJWT.js:

```javascript
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  // console.log(authHeader); // e.g., Bearer token.example.pXVCJ9.eyJ1c2VybmFtZ
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // invalid token
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
```

## controllers/authController.js:

```javascript
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // Generate an Access Token (short-lived)
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" } // (5-15 min in production)
    );

    // Generate a Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Save the Refresh Token with the Current User in the Database
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    // Send the Access Token to the Client
    res.json({ accessToken }); // should be stored in memory on the frontend

    // Send the Refresh Token to the Client
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // the cookie cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === "production", // ensure the cookie is sent over HTTPS in production
      sameSite: "None", // allow cross-origin requests
      maxAge: 24 * 60 * 60 * 1000, // token expiration (1 day in this example)
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
```
