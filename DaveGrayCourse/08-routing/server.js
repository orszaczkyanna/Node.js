const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

// ------ Custom Middleware (logger) ------
app.use(logger);

// ------ Third-party Middleware (Cross-Origin Resource Sharing) ------
const whitelist = [
  "http://www.yoursite.com",
  "http://yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccesStatus: 200,
};

app.use(cors(corsOptions));

// ------ Built-in Middleware ------
app.use(express.urlencoded({ extended: false })); // for forms (handle urlencoded data)
app.use(express.json()); // for json

// serve static files (css, images, etc.)
app.use(express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public"))); // default is a '/'

// ------ ROUTES ------
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees")); // API example

// ---- last: catch-all route ----
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
