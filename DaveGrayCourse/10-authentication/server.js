const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

// ------ Custom Middleware (logger) ------
app.use(logger);

// ------ Third-party Middleware (Cross-Origin Resource Sharing) ------
app.use(cors(corsOptions));

// ------ Built-in Middleware ------
app.use(express.urlencoded({ extended: false })); // for forms (handle urlencoded data)
app.use(express.json()); // for json

// serve static files (css, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// ------ Routes ------
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
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
