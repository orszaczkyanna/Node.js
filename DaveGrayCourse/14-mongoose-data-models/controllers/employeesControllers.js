const data = {
  employees: require("../model/employees.json"), // Load the employees data from a JSON file
  setEmployees: function (data) {
    this.employees = data; // Update the employees data
  },
};

// ---- Define the CRUD Route Handlers as functions ----

// -- Retrieve all employees --
const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

// -- Create a new employee --
const createNewEmployee = (req, res) => {
  // Create a new employee object
  const newEmployee = {
    id: data.employees?.length
      ? data.employees[data.employees.length - 1].id + 1 // Generate a new ID by incrementing the last employee's ID
      : 1, // Default to 1 if there are no employees
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  // Validate the input: both first and last names are required
  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400) // Bad Request
      .json({ message: "First and last names are required." });
  }

  // Add the new employee to the array and update the data
  data.setEmployees([...data.employees, newEmployee]);

  // Respond with the updated array
  res.status(201).json(data.employees); // 201: Successfully Created
};

// -- Update an existing employee --
const updateEmployee = (req, res) => {
  // Find the employee by ID
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );

  // If the employee ID doesn't exist, respond with HTTP 400 (Bad Request)
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }

  // Update the employee's details if provided in the request body
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;

  // Rebuild the employee array without the updated employee
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );

  // Add the updated employee to the end of the array
  const unsortedArray = [...filteredArray, employee];

  // Sort the employees array by their IDs in ascending order
  data.setEmployees(
    // unsortedArray.sort((a, b) => a.id - b.id)

    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))

    // - If `a.id` is greater than `b.id`, return 1 (place `a` after `b`)
    // - If `a.id` is less than `b.id`, return -1 (place `a` before `b`)
    // - If `a.id` and `b.id` are equal, return 0 (keep the original order)

    // 1 => [b, a]
    // -1 => [a, b]
    // 0 => [original order]
  );

  // Respond with the updated array of employees
  res.json(data.employees);
};

// -- Delete an employee --
const deleteEmployee = (req, res) => {
  // Find the employee to delete by ID
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );

  // Check if the employee exists
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }

  // Remove the employee from the array
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  data.setEmployees([...filteredArray]);

  // Response
  res.json(data.employees);
};

// -- Retrieve a specific employee by their ID --
const getEmployee = (req, res) => {
  // Find the employee by ID in the route parameter
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );

  // Check if the employee exists
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }

  // Response
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
