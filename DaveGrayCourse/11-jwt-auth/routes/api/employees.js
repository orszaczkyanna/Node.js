const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesControllers");

// const verifyJWT = require("../../middleware/verifyJWT");

// -- Chained HTTP Methods for the Root '/' route --
// http://localhost:3500/employees
router
  .route("/")
  // .get(verifyJWT, employeesController.getAllEmployees)
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

// -- Route Accepting URL Parameter --
// http://localhost:3500/employees/2
router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
