# [bcrypt](https://www.npmjs.com/package/bcrypt)

`npm i bcrypt`

Bcrypt is a library used to securely turn passwords into a fixed-length string (called a "hash") that cannot easily be reversed back to the original password.

Usage:

```javascript
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "example123";

// hash the password
const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);

// check the password
const match = await bcrypt.compare(
  myPlaintextPassword,
  foundUser.hashedPassword
);
```

# Register a New User

- test the `/register` endpoint using a POST request with a JSON body:

```
{
  "user": "JohnDoe1",
  "pwd": "Example123"
}
```

- **server.js:**

```javascript
// ...
app.use("/register", require("./routes/register"));
// ...
```

- **routes/register.js:**

```javascript
const express = require("express");
const router = express.Router();
const { handleNewUser } = require("../controllers/registerController");

// Use POST to submit new information or credentials like usernames and passwords
router.post("/", handleNewUser);

module.exports = router;
```

- **controllers/registerController.js:**

```javascript
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400) // Bad Request
      .json({ message: "Username and password are required." });
  }

  // Check for duplicate in the "database"
  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409); // Conflict

  try {
    // Hash the password
    const hashedPwd = await bcrypt.hash(pwd, saltRounds);

    // Store the new user
    const newUser = {
      username: user,
      password: hashedPwd,
    };

    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    console.log(usersDB.users);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
```

# Notes

## `req` and `res`

- `req`: What the **_client sends_** to the server.
- `res`: What the **_server sends back_** to the client.

## _Authentication_ or _Authorization_

- **Authentication**: verifies the **identity** of a user. (Hitelesítés)

Example: Logging in with a username and password to access your email account.

- **Authorization**: determines what actions or resources a user is allowed to access. (Engedélyezés)

Example: A regular user can view posts, but only an admin can delete them.

## _Encrypt_ or _Hash_

- **Encrypt**: Transforms data into a secure format that **_can be reversed_** (decrypted) using a key. It ensures data confidentiality.

Example: Encrypting a message to send securely over the internet.

- **Hash**: Converts data into a fixed-length string (hash) that **_cannot be reversed_**. It is used for data verification.

Example: Storing a password as a hash in a database.
