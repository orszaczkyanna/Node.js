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
  // Username and password must be provided
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Check if user exists in the database
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  // Evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    // --- Create JWTs ---
    // Generate an Access Token (short-lived)

    const accessToken = jwt.sign(
      // Payload: Include user info (avoid sensitive data like passwords)
      {
        // "UserInfo": namespace
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET, // Secret key
      { expiresIn: "30s" } // Use a short lifespan (e.g., 5-15 min in production)
    );

    // Generate a Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Save the Refresh Token with the Current User in the Database
    // this allows us to create a logout route later
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);

    // Save the updated users to the file
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    // Send both the access token and the refresh token to the user

    // Cookies must be set before the response body is sent
    // HTTP headers, including Set-Cookie, must be sent before the response body
    // res.cookie() modifies the HTTP headers, which cannot be changed after res.json() begins sending the response body

    // Refresh Token
    res.cookie("jwt", refreshToken, {
      // 'jwt': Name of the cookie storing the refresh token
      // 'refreshToken': The long-lived token for renewing access tokens
      httpOnly: true, // The cookie cannot be accessed by JavaScript
      // secure: true, // Ensure the cookie is sent over HTTPS // Cookies blocked in Thunder Client as 'secure: true' requires HTTPS
      secure: process.env.NODE_ENV === "production", // In production, 'secure: true' ensures HTTPS; in development, set to false for local testing
      sameSite: "None", // Allow cross-origin requests
      maxAge: 24 * 60 * 60 * 1000, // Token expiration (1 day in this example)
    });

    // Access Token
    // The access token should be stored in MEMORY on the FRONTEND (not in localStorage or cookies)
    // to prevent attacks like XSS and avoid unintended persistent access.
    res.json({ accessToken });

    // res.json({ success: `User ${user} is logged in` }); // success message in the response
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
