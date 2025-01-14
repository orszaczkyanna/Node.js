const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;

// // ---- res.send() ----
// app.get("/", (req, res) => {
//   res.send("GET request to the homepage");
// });

// ---- res.sendFile() ----
app.get("^/$|index(.html)?", (req, res) => {
  // res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

// ---- res.redirect() ----
app.get("/old-page(.html)?", (req, res) => {
  // res.redirect("/new-page.html"); // 302 (Temporary Redirect) by default
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
app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
