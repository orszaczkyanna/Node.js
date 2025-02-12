# Async CRUD Operations in `employeesControllers.js`

## Import Employee model

```javascript
const Employee = require("../model/Employee");
```

## Read All Employees (GET)

```javascript
const getAllEmployees = async (req, res) => {
  // Find all employees in the database
  const employees = await Employee.find().exec();

  // If the result is an empty array, return 204 (No Content)
  // Using 204 instead of 404 to indicate the request was valid, but no data was found.
  // ! 204 status should not send a JSON body ( e.g., .json({ message: "message" }) )
  // Industry standard would typically use 404 for a missing resource (which is allowed to send a JSON body).
  if (employees.length === 0) return res.sendStatus(204);

  res.json(employees);
};
```

## Create (POST)

```javascript
const createNewEmployee = async (req, res) => {
  // Validate the input
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required." });
  }

  // Create and store the new employee
  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
```

## Update (PUT)

```javascript
const updateEmployee = async (req, res) => {
  // Validate the input
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Employee ID is required." });
  }

  // Find the employee by ID in the request body
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  // If the employee ID doesn't exist, respond with HTTP 204 (No Content)
  if (!employee) {
    return res.sendStatus(204);
  }

  // Update the employee's details if provided in the request body
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  // Save the changes in the database
  const result = await employee.save();
  res.json(result);
};
```

## Delete (DELETE)

```javascript
const deleteEmployee = async (req, res) => {
  // Validate the input
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Employee ID is required." });
  }

  // Find the employee to delete by ID in the request body
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  // If the employee ID doesn't exist, respond with HTTP 204 (No Content)
  if (!employee) {
    return res.sendStatus(204);
  }

  // Remove the employee from the database
  const result = await employee.deleteOne(); // { _id: req.body.id }
  res.json(result);
};
```

## Read One Employee by ID (GET)

```javascript
const getEmployee = async (req, res) => {
  // Validate the input
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  // Find the employee by ID in the route parameter
  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  // Check if the employee exists
  if (!employee) {
    return res.sendStatus(204);
  }

  // Send response with the employee data
  res.json(employee);
};
```

## Export the handlers

```javascript
// Used in routing
module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
```
