# Verify Roles

## roles_list.js

In this example, the _roles list_ is stored in an object.

```javascript
const ROLES_LIST = {
  Admin: 5150,
  Editor: 1984,
  User: 2001,
};

module.exports = ROLES_LIST;
```

## controllers/registerController.js

Each newly registered user is automatically assigned the 'User' role.

```javascript
// ...
// Store the new user
const newUser = {
  username: user,
  roles: { User: 2001 }, // Add the 'User' role by default to new users
  password: hashedPwd,
};
// ...
```

## controllers/authController.js

The **_access token_** includes the **_user's roles_**.

Note: Unlike access tokens, refresh tokens do **not** carry role data.

```javascript
// ...
// Generate an access token (short-lived)
const roles = Object.values(foundUser.roles); // Extract the roles assigned to the found user as an array
const accessToken = jwt.sign(
  {
    // Add a "UserInfo" namespace to group username and roles in the payload
    UserInfo: {
      username: foundUser.username,
      roles: roles, // Include the user's roles (array) in the token under the 'roles' property
    },
  },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: "30s" }
);
// ...
```

## controllers/refreshTokenController.js

Add the same roles-related code to the (refreshed) **_access token_** as in authController.js, but replace `foundUser.username` with `decoded.username`.

```javascript
// ...
// Generate a new access token
const roles = Object.values(foundUser.roles); // Extract roles as an array
const accessToken = jwt.sign(
  {
    UserInfo: {
      username: decoded.username, // Use the username from the decoded refresh token
      roles: roles, // Include the user's roles
    },
  },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: "30s" }
);
// ...
```

## middleware/verifyJWT.js

Update the user information in the request object.

```javascript
// ...
// Attach the decoded user information to the request object
req.user = decoded.UserInfo.username; // Updated: Now uses the 'UserInfo' namespace for the username (was previously just decoded.username)
req.roles = decoded.UserInfo.roles; // New: Includes the user's roles in the request object for role-based authorization
// ...
```

## middleware/verifyRoles.js

This middleware ensures that the user has at least one of the required roles.

It is designed to protect routes by ensuring that only users with the appropriate permissions can proceed. The function receives a list of allowed roles as arguments, and checks whether any of the roles the user possesses matches one of the allowed roles. If there is a match, the request proceeds to the next middleware or route handler. If no matching role is found, access is denied, and a _401 Unauthorized_ status is returned.

This is useful when you want to restrict access based on user roles, such as allowing only "Admin" or "Editor" roles to access a specific route.

```javascript
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    // Check if any user role matches an allowed role
    const result = req.roles
      .map((role) => rolesArray.includes(role)) // Create a boolean array indicating role matches
      .find((val) => val === true); // Look for the first 'true' (a matching role)
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
```

## routes/api/employees.js

The `verifyRoles()` middleware is applied to the employee API to restrict access based on roles.

```javascript
//...
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(employeesController.getAllEmployees) // Accessible to any authenticated user because a valid JWT is required (assumed 'User' role)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), // Only Admins and Editors can create employees
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), // Only Admins and Editors can update employees
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee); // Only Admins can delete employees
//...
```
