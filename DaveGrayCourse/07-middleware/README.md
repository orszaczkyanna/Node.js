# [Middleware](https://expressjs.com/en/guide/using-middleware.html)

Middleware is any function that runs **between the `request` and the `response`**.

```javascript
const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});
```

## Built-in Middleware

- `app.use(express.urlencoded({ extended: false }))` parses **form** data
- `app.use(express.json());` parses **JSON** payloads
- `app.use(express.static(path.join(__dirname, "public")));` serves static files (without this, CSS and images won't load)

## Custom Middleware

```javascript
const myLogger = (req, res, next) => {
  console.log("LOGGED");
  next();
};
```

- custom middleware **requires a `next` function** to pass control to the next middleware
- organize custom middleware by placing them in separate files inside a **`middleware` folder**

### custom error handler

handles errors and sends a custom error message to the browser

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message);
});
```

## Third-party Middleware

- [cors](https://www.npmjs.com/package/cors) `npm i cors`

[Configuring CORS with Dynamic Origin](https://www.npmjs.com/package/cors#configuring-cors-w-dynamic-origin)

```javascript
const whitelist = [
  "http://www.yoursite.com",
  "http://yoursite.com",
  "http://127.0.0.1:5500", // for development
  "http://localhost:3500", // for development
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // || !origin: for development
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccesStatus: 200,
};

app.use(cors(corsOptions));
```

# [req Object Properties](https://expressjs.com/en/4x/api.html#req.app)

- `req.url` - the complete URL string of the request (e.g., `/new-page.html`)
- `req.method` - the HTTP method of the request (e.g., `GET`, `POST`, `PUT`)
- `req.path` - only the path portion of the URL (e.g., `/css/style.css`)
- `req.headers.origin` - the URL of the website that sent the request (e.g., `https://www.google.com`); when `undefined`, it usually indicates a request from `localhost`

# Methods

**`app.use()`**

- for **middleware**
- in older versions of express doesn't accept regex

**`app.all()`**

- for routing
- applies to all _http methods (get, put, post, delete)_ at once

catch-all route:

```javascript
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});
```

# Notes

To test **requests from other pages** in the browser's DevTools console:

DevTools/Console => `fetch('http://localhost:3500')`
