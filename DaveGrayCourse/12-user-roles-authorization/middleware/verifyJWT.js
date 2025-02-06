// Verify the Access Token

const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  // Get the 'Authorization' http header from the request
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // If the 'Authorization' header is missing, return 401 (Unauthorized)
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); // 401: Unauthorized
  // console.log(authHeader); // e.g., Bearer token.example.pXVCJ9.eyJ1c2VybmFtZ

  // Extract the token from the header (after 'Bearer' word)
  const token = authHeader.split(" ")[1];

  // Verify the token using the secret key and decode it
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // If token verification fails (invalid or expired token), return 403 Forbidden
    if (err) return res.sendStatus(403); // 403: Forbidden // invalid token

    // If token is valid, attach the decoded user information to the request object
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;

    // Call the next middleware function (continue the request-response cycle)
    next();
  });
};

module.exports = verifyJWT;
