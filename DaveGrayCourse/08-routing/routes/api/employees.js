const express = require("express");
const router = express.Router();

const data = {};
data.employees = require("../../data/employees.json");

// router.get("/", (req, res) => {});
// router.get(); router.post(); router.put(); router.delete();

// -- Chained HTTP Methods for the Root '/' route --
// http://localhost:3500/employees
router
  .route("/")
  .get((req, res) => {
    // Retrieve all employees
    res.json(data.employees);
  })
  .post((req, res) => {
    // Create a new employee
    res.json({
      // key: value
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

// -- Route Accepting URL Parameter --
// http://localhost:3500/employees/2
router.route("/:id").get((req, res) => {
  res.json({
    id: req.params.id,
  });
});

module.exports = router;
