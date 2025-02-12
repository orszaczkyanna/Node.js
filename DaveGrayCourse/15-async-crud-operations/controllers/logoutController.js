const User = require("../model/User");

const handleLogout = async (req, res) => {
  // On client (frontend), also delete the accessToken!

  const cookies = req.cookies;

  // Ensure the request includes cookies
  if (!cookies?.jwt) return res.sendStatus(204); // (Successful but) No Content
  const refreshToken = cookies.jwt;

  // Check if the refresh token exists in the database
  const foundUser = await User.findOne({ refreshToken }); // { refreshToken: refreshToken }
  if (!foundUser) {
    res.clearCookie("jwt", {
      // same options as when it was sent
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      // maxAge: 24 * 60 * 60 * 1000, // maxAge does not need to be set when you delete the cookie
    });

    return res.sendStatus(204); // No Content
  }

  // Delete the refreshToken in the database
  // foundUser.refreshToken = "";
  // const result = await foundUser.save(); // Save the changes in the MongoDB database
  // console.log(result);

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  res.sendStatus(204);
};

module.exports = { handleLogout };
