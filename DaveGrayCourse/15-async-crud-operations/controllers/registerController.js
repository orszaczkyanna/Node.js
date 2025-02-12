const User = require("../model/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400) // Bad Request
      .json({ message: "Username and password are required." });
  }

  // Check for duplicate in the database
  const duplicate = await User.findOne({ username: user }).exec(); // usersDB.users.find((person) => person.username === user)
  if (duplicate) return res.sendStatus(409); // Conflict
  // sendStatus(): sends the string representation of the status code

  try {
    // Hash the password
    const hashedPwd = await bcrypt.hash(pwd, saltRounds);

    // Create and Store the new user
    const result = await User.create({
      username: user,
      // default: roles: { User: 2001 }
      password: hashedPwd,
    });

    console.log(result);

    // usersDB.setUsers([...usersDB.users, newUser]);

    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(usersDB.users)
    // );

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
