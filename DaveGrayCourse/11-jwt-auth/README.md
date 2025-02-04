# JWT (JSON Web Token) Authorization

- JWT is commonly used for user authentication and authorization.
- Protected Routes: JWTs restrict access to routes by verifying user identity.
- Access Token and Refresh Token are issued after user authentication (login).
- Access Token (short-lived): used by the client to make authenticated API requests.
- Refresh Token (long-lived): used by the client to obtain a new access token.

**Frontend Security Guidelines for JWT Tokens**

- **Access Token**: Store in memory (not in localStorage or cookies) to reduce the risk of theft through XSS attacks, as memory is cleared when the page reloads or the session ends.
- **Refresh Token**: Store as an httpOnly cookie, which is not accessible via JavaScript, to protect it from XSS attacks.

**Notes and Definitions**

- **XSS (Cross-Site Scripting)**: A vulnerability where attackers inject malicious scripts into websites, executed in users' browsers to steal data or hijack sessions.

# NPMs

npm i jsonwebtoken cookie-parser dotenv

- [dotenv](https://www.npmjs.com/package/dotenv) `npm i dotenv`
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) `npm i cookie-parser`
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) `npm i jsonwebtoken`

## dotenv

- `process.env.SECRET`

```javascript
require("dotenv").config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
```

Calling `require("dotenv").config()` is only needed in the entry point (server.js/app.js).

## cookie-parser

- `res.cookie()`
- `req.cookies.cookieName`

```javascript
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Set Cookie
res.cookie("cookieName", "cookieValue", options);

// Read Cookie
const cookieName = req.cookies.cookieName;
```

## jsonwebtoken

- `jwt.sign()`
- `jwt.verify()`

```javascript
const jwt = require("jsonwebtoken");

// Create Token
const tokenName = jwt.sign(payload, secretOrPrivateKey, options); // payload: e.g, { username: "John" }

// Verify Token
jwt.verify(tokenName, secretOrPrivateKey, (err, decoded) => {
  if (err) {
    return res.sendStatus(403); // Forbidden
  }
  console.log(decoded.username); // decoded: the decoded payload of the token
});
```

# Generate Token Secrets

- Create a `.env` file to store token secrets
- Add `.env` to `.gitignore`
- Generate random crypto strings as secrets by running in the terminal:
  - `node`
  - `require('crypto').randomBytes(64).toString('hex')`
