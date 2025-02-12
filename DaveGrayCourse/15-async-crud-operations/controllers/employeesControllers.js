const Employee = require("../model/Employee");

// ---- Define the CRUD Route Handlers as functions ----

// -- Retrieve all employees --
const getAllEmployees = async (req, res) => {
  // Find all employees in the database
  const employees = await Employee.find().exec();

  // If the result is an empty array, return 204 (No Content)
  // If no employees are found, Mongoose returns an empty array []
  if (employees.length === 0)
    return res.status(204).json({ message: "No employees found." });
  res.json(employees);
};

// -- Create a new employee --
const createNewEmployee = async (req, res) => {
  // Validate the input: both first and last names are required
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400) // Bad Request
      .json({ message: "First and last names are required." });
  }

  // Create and store the new employee
  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    // Respond with the created employee
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

// -- Update an existing employee --
const updateEmployee = async (req, res) => {
  // Validate the input
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Employee ID is required." });
  }

  // Find the employee by ID
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  // If the employee ID doesn't exist, respond with HTTP 204 (No Content) and a message
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}.` });
  }

  // Update the employee's details if provided in the request body
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  // Save the changes in the database
  const result = await employee.save();
  res.json(result);
};

// -- Delete an employee --
const deleteEmployee = async (req, res) => {
  // Validate the input
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Employee ID is required." });
  }

  // Find the employee to delete by ID
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  // If the employee ID doesn't exist, respond with HTTP 204 (No Content) and a message
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}.` });
  }

  // Remove the employee from the database
  const result = await employee.deleteOne(); // { _id: req.body.id }
  res.json(result);
};

// -- Retrieve a specific employee by their ID --
const getEmployee = async (req, res) => {
  // Validate the input
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  // Find the employee by ID in the route parameter
  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  // Check if the employee exists
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.params.id}.` });
  }

  // Send response with the employee data
  res.json(employee);
};

// -- Export the handlers to use them in routing --
module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
