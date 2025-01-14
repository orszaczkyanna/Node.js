# [Express](https://expressjs.com/en/guide/routing.html)

`npm i express` https://www.npmjs.com/package/express

```javascript
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;

app.get("^/$|index(.html)?", (req, res) => {
  // res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

# Methods

- `app.get('/', (req, res) => {})` routes GET requests to the specified path
- `res.send()` sends a **string** or object response
- `res.sendFile(path)` sends the **file** at the given path
- `res.redirect(301, url)` redirects to the **URL**, with _Permanent Redirect_ status code
- `res.status()` sets the HTTP **status code** for the response

# Regex in JS

- `^a` starts with 'a'
- `a$` ends with 'a'
- `()` for groups
- `(.html)?` '.html' is optional
- `/*` **in Express routes**: matches any path after the root '/'
- `*` zero or more occurrences of the preceding character

# Notes

Express handles routes sequentially, like a waterfall.

The last route, often called the **catch-all route**, acts as the default or fallback route.
