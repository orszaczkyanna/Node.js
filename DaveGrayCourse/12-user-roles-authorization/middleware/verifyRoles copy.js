const verifyRoles = (...allowedRoles) => {
  // Return a middleware function that checks user roles
  return (req, res, next) => {
    // If the request object does not have a roles property, deny access (401 Unauthorized)
    if (!req?.roles) return res.sendStatus(401);

    // Convert the allowedRoles (spread into an array) into a new array
    const allowedRolesArray = [...allowedRoles];

    console.log("allowedRolesArray\n", allowedRolesArray); // required roles to access the route e.g., [ 5150, 1984 ]
    console.log("req.roles\n", req.roles); // roles the user has e.g., [ 2001, 1984, 5150 ] if admin; [ 2001 ] if user

    // Compare  arrays: Check if any of the user's roles match the allowed roles
    const result = req.roles
      .map((role) => allowedRolesArray.includes(role)) // new array with 'true' and 'false' results e.g., [false, false, true]
      .find((val) => val === true); // find the first 'true'

    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
