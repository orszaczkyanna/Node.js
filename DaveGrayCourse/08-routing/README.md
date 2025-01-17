# [express.Router](https://expressjs.com/en/guide/routing.html)

**Routers** in Express are essentially **mini-servers** or **mini-apps** designed to handle requests for specific routes.

They help in organizing code by allowing route handlers to be defined in **separate files**, making the application **modular** and **maintainable**. This is particularly useful in larger projects.

## Key Concepts

- Router creation: `const router = express.Router();`
- Defining routes: `router.get("/", (req, res) => {});`
  - Chained HTTP Methods: `router.route("/").get(...).post(...).put(...).delete(...);`
  - Dynamic Routes: `router.get("/:id", (req, res) => {})` or `router.route("/:id").get(...)`
- Mounting routers: `app.use("/", require("./routes/root"));`

# Modular Routing Example

subdir.js:

```javascript
const express = require("express");
const router = express.Router();
const path = require("path");

// Route for the subdir index
router.get("^/$|index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "index.html"));
});

// Route for the subdir test page
router.get("/test(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "test.html"));
});

module.exports = router;
```

server.js:

```javascript
// Mount modular routers for different route paths
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));

// Serve static files (e.g., CSS, images)
app.use(express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public")));
```

# Chained HTTP Methods for APIs

When creating an API, chaining HTTP methods for a **specific route** can simplify the code and improve readability.

- `"/"` All of these methods apply to the root route
- `GET`: Retrieves a list of employees
- `POST`: Adds a new employee with the data provided in the request body
- `PUT`: Updates an existing employee using data from the request body
- `DELETE`: Removes an employee specified by the ID in the request body

```javascript
router.route("/")
  .get((req, res) => {
    // Retrieve all employees
    res.json(data.employees);
  })
  .post((req, res) => {
    // Create a new employee
    res.json({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  })
  .put((req, res) => {
    // Update an existing employee
    res.json({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  })
  .delete((req, res) => {
    // Delete an employee
    res.json({
      id: req.body.id,
    });
  });
```

# Handling URL Parameters

Routers can also handle dynamic segments in the URL using **parameters**. The example below shows how to define a route that accepts an `id` parameter and returns it in the response.

```javascript
router.route("/:id").get((req, res) => {
  res.json({
    id: req.params.id,
  });
});
```
