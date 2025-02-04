# [cookie-parser](https://www.npmjs.com/package/cookie-parser)

npm i cookie-parser

## Usage

```javascript
// Import Package (server.js)
const cookieParser = require("cookie-parser");
app.use(cookieParser()); // use middleware before working with cookies

// Set Cookie (auth controller, refresh token)
res.cookie("jwt", refreshToken, {
  httpOnly: true, // can't be accessed by JS
  secure: process.env.NODE_ENV === "production", // HTTPS
  sameSite: "None", // allow cors
  maxAge: 24 * 60 * 60 * 1000, // expiration
});

// Read Cookie (refresh and logout controllers)
const refreshToken = req.cookies.jwt;
```

## Credentials

Don't forget to specify `credentials: 'include'` in the `fetch()` options on the **_frontend_** if you need cookies.

### frontend

- main.js:

```javascript
// ...
const response = await fetch("http://localhost:3500/auth", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // for cookies
  body: JSON.stringify({ user, pwd }),
});
// ...
```

### backend

- server.js:

```javascript
// ...
const credentials = require("./middleware/credentials");
// ...
app.use(credentials); // use it before CORS
// ...
```

- middleware/credentials.js:

```javascript
const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", true);
  }
  next();
};

module.exports = credentials;
```

- config/allowedOrigins.js:

```javascript
const allowedOrigins = [
  "http://www.yoursite.com",
  "http://yoursite.com",
  "http://127.0.0.1:5500", // for development
  "http://localhost:3500", // for development
];

module.exports = allowedOrigins;
```
