# [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

npm i jsonwebtoken

- `jwt.sign(payload, secretOrPrivateKey, [options, callback])` - creates and secures the token
- `jwt.verify(token, secretOrPublicKey, [options, callback])` - validates and decodes the token

## Usage

### controllers/authController.js:

```javascript
// ...
// Generate an Access Token (short-lived)
const accessToken = jwt.sign(
  { username: foundUser.username }, // Payload: Include user info (avoid sensitive data like passwords)
  process.env.ACCESS_TOKEN_SECRET, // Secret key
  { expiresIn: "10m" } // Use a short lifespan (e.g., 5-15 min in production)
);

// Generate a Refresh Token (long-lived)
const refreshToken = jwt.sign(
  { username: foundUser.username },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: "1d" }
);
// ...
```

### server.js:

```javascript
const verifyJWT = require("./middleware/verifyJWT");
// ...
app.use(verifyJWT); // middleware
```

### middleware/verifyJWT.js:

- The **_access_** token is verified on **_each_** request.
- In HTTP requests, authentication tokens are usually in the `Authorization` header, starting with **"Bearer"** followed by the **token**.

```javascript
// Verify the access token
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  // console.log(authHeader); // e.g., Bearer token.example.pXVCJ9.eyJ1c2VybmFtZ
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // 403: Forbidden // invalid token
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
```

### controllers/refreshTokenController.js:

```javascript
// ...
const refreshToken = req.cookies.jwt;
// ...
// Verify the refresh token
jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
  if (err || foundUser.username !== decoded.username) {
    return res.sendStatus(403);
  }
  // Generate a new access token (short-lived)
  const accessToken = jwt.sign(
    { username: decoded.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  // Respond with the new access token
  res.json(accessToken);
});
// ...
```
