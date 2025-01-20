# API

When working with Node.js and Express, we often create **APIs** rather than static web pages.

An API acts as a **_bridge_** between the **_frontend_** and **_backend_**, allowing them to exchange data. The backend uses the API to interact with **_databases_**, while the frontend communicates only with the backend.

# HTTP Methods - CRUD

- **POST**: Add new data (**Create**)
- **GET**: Retrieve data (**Read**)
- **PUT**: Modify existing data (**Update**)
- **DELETE**: Remove existing data (**Delete**)

# MVC REST API

Model-View-Controller is a **_software design pattern_** used to separate an application into three interconnected components.

- **Model**: Data (e.g., `databases` or `.json` files)

- **View**: UI (e.g., `HTML`)

- **Controller**: Logic (e.g., `JavaScript` functions)

## Model

The Model stores and manages the application's **_data_**.

- Example: `model/employees.json` stores employee records, simulating a database.

## View

The View displays information to the user **_(User Interface)_**.

- In REST APIs, Views are often minimal or non-existent, as the API typically sends raw data (e.g., JSON responses).
- Example: A simple HTML page might provide instructions for using the API. `views/index.html`

## Controller

The Controller connects the **_View_** and the **_Model_**. In a REST API, it handles communication between the **_client_** and the **_Model_**, processing requests and sending appropriate responses.

- Organized into files such as `controllers/employeesController.js`.
- Each function in the Controller corresponds to a **_route_** and handles specific logic.

Example: A function to retrieve an employee by ID:

```javascript
const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }
  res.json(employee);
};
```

# Notes

- **Configuration**: `config/corsOptions.js` for handling CORS settings.
