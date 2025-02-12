const verifyRoles = (...allowedRoles) => {
  // Return a middleware function that checks user roles
  return (req, res, next) => {
    // If the request object does not have a roles property, deny access (401 Unauthorized)
    if (!req?.roles) return res.sendStatus(401);

    // Convert the allowedRoles (spread into an array) into a new array
    const allowedRolesArray = [...allowedRoles];

    // Log the roles that are allowed to access the route
    console.log("allowedRolesArray\n", allowedRolesArray); // e.g., [ 5150, 1984 ]
    // Log the roles that the user possesses
    console.log("req.roles\n", req.roles); // e.g., [ 2001, 1984, 5150 ] for admin; [ 2001 ] for a regular user

    // Compare  arrays: Check if any of the user's roles match the allowed roles
    // Compare the user's roles to the allowed roles
    const result = req.roles
      // Map over the user's roles
      // For each role in req.roles, check if it is present in allowedRolesArray, and return 'true' or 'false' for each
      .map((role) => allowedRolesArray.includes(role)) // Creates a new array of boolean values, e.g., [false, false, true]
      // Find the first 'true' value in the array, meaning at least one role is authorized
      .find((val) => val === true); // If no 'true' is found, result will be undefined

    /*
    Why this works: We only need to confirm that the user has at least one allowed role.
    The "find" method stops as soon as it finds a 'true' value, meaning at least one role is authorized.
    It doesn't matter which role matches, as long as one does, access is granted.
    If a route needs stricter control (e.g., only Admin access), the allowedRoles should reflect that.
    For example, verifyRoles(ROLES_LIST.Admin) in a route ensures only Admins can access that route.
    */

    // If no matching role is found, deny access (401 Unauthorized)
    if (!result) return res.sendStatus(401);

    // If a matching role exists, proceed to the next middleware or route handler
    next();
  };
};

module.exports = verifyRoles;
