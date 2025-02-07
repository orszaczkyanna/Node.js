require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// custom middleware - Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// third-party middleware (Cross-Origin Resource Sharing)
app.use(cors(corsOptions));

// built-in middleware for forms (to handle urlencoded data)
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// third-party middleware for cookies
app.use(cookieParser());

// serve static files (css, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Routes (~ .use() for middlewares)
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT); // verifyJWT middleware
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
