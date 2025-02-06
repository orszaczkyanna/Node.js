# User Roles | Authorization

Restrict access to specific API routes based on user roles. This system ensures that only users with the appropriate roles can perform certain actions.

The **_access token_** includes the user's roles for authorization purposes. Note: Refresh tokens do **not** contain role information.

## Highlighted Examples for Implementation

- routes/api/employees.js:

Note: This snippet highlights the usage of `verifyRoles`; additional route definitions are omitted for brevity.

```javascript
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.route("/").post(
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), // Only Admins and Editors can create employees
  employeesController.createNewEmployee
);
```

- middleware/verifyRoles.js:

```javascript
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];

    // Check if any user role matches an allowed role
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);

    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
```
