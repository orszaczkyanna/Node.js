const jwt = require("jsonwebtoken");
const User = require("../model/User");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  // Ensure the request includes cookies
  // console.log("Received cookie:", cookies.jwt);
  if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

  const refreshToken = cookies.jwt;

  // Check if the refresh token exists in the database
  const foundUser = await User.findOne({ refreshToken }).exec(); // { refreshToken: refreshToken }
  if (!foundUser) return res.sendStatus(403); // Forbidden

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }
    // Generate a new access token (short-lived)
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // (5-15 min in production)
    );
    // Respond with the new access token
    res.json(accessToken);
  });
};

module.exports = { handleRefreshToken };
