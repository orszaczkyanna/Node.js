# Logout Route

Delete the refresh token from the database.

(The access token should also be erased on the frontend.)

## server.js:

```javascript
// ...
app.use("/logout", require("./routes/logout"));
// ...
```

## routes/logout.js:

```javascript
const express = require("express");
const router = express.Router();
const { handleLogout } = require("../controllers/logoutController");

router.post("/", handleLogout);

module.exports = router;
```

## controllers/logoutController.js:

```javascript
const fsPromises = require("fs").promises;
const path = require("path");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleLogout = async (req, res) => {
  // On client (frontend), also delete the accessToken!

  const cookies = req.cookies;

  // Ensure the request includes cookies
  if (!cookies?.jwt) return res.sendStatus(204); // (Successful but) No Content
  const refreshToken = cookies.jwt;

  // Check if the refresh token exists in the database
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", {
      // same options as when it was sent (except for maxAge)
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.sendStatus(204); // No Content
  }

  // Delete the refreshToken from the database
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  console.log("currentUser:\n", currentUser);
  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  res.sendStatus(204);
};

module.exports = { handleLogout };
```
