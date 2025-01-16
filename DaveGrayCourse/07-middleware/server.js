const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

// ------ CUSTOM MIDDLEWARE (logger) ------
app.use(logger);

// ------ THIRD-PARTY MIDDLEWARE (Cross-Origin Resource Sharing) ------

// Enable CORS for these domains (frontend URLs) that should have access to this backend
const whitelist = [
  "http://www.yoursite.com", // your production site
  "http://yoursite.com", // alternate production site
  "http://127.0.0.1:5500", // local server for frontend development (e.g., using Live Server)
  "http://localhost:3500", // local server for backend development
  // "https://www.google.com", // example: allow google to access your API
];

const corsOptions = {
  origin: (origin, callback) => {
    // origin in the (origin, callback): the domain that makes the request (e.g., google.com)
    // Check if the domain is in the whitelist
    // if (whitelist.indexOf(origin) !== -1) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // || !origin: allow requests with "undefined" origins (e.g., Postman or local dev tools)
      callback(null, true); // "null" for no error, "true" for allowed
    } else {
      callback(new Error("Not allowed by CORS")); // deny access
    }
  },
  optionSuccesStatus: 200, // for compatibility with older browsers
};

app.use(cors(corsOptions));

// ------ BUILT-IN MIDDLEWARE ------

// built-in middleware to handle urlencoded data (for forms)
// content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// serve static files (css, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// ---- res.sendFile() ----
app.get("^/$|index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

// ---- res.redirect() ----
app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); // 301 (Permanent Redirect)
});

// ---- Route Handlers with function chaining ----
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
  },
  (req, res) => {
    res.send("Hello World!");
  }
);

// A more common way to chain functions together:
const one = (req, res, next) => {
  console.log("one");
  next();
};

const two = (req, res, next) => {
  console.log("two");
  next();
};

const three = (req, res) => {
  console.log("three");
  res.send("Finished!");
};

app.get("/chain(.html)?", [one, two, three]);

// ---- last: catch-all route ----

// app.get("/*", (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

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

// custom error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
