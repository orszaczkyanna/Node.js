const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesControllers");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// const verifyJWT = require("../../middleware/verifyJWT");

// -- Chained HTTP Methods for the Root '/' route --
// http://localhost:3500/employees
router
  .route("/")
  // .get(verifyJWT, employeesController.getAllEmployees)
  .get(employeesController.getAllEmployees) // 'User' is the default necessary role because JWT is required
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

// -- Route Accepting URL Parameter --
// http://localhost:3500/employees/2
router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
