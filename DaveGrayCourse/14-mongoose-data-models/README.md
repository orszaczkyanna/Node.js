# [Schemas](https://mongoosejs.com/docs/guide.html#definition)

Each **_schema_** maps to a MongoDB **_collection_** and defines the shape of the documents within that collection.

## model/User.js:

- A schema acts as a blueprint for a collection.
- Mongoose automatically looks for the **pluralized, lowercased** version of the [model](https://mongoosejs.com/docs/models.html) name when determining the collection name. (e.g., `User` model → `users` collection)
- `ObjectId` is created automatically.

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number, // no default value; not required
    Admin: Number, // same as above
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String, // 'String' is shorthand for {type: String}
});

module.exports = mongoose.model("User", userSchema);
```

## controllers/registerController.js:

```javascript
const User = require("../model/User");
// ...
// Check for duplicate in the database
const duplicate = await User.findOne({ username: user }).exec(); // Find a user with 'username' (DB field) equal to 'user' (value from req.body)
// ...
// Create and Store the new user
const result = await User.create({
  username: user,
  password: hashedPwd,
});
// ...
```

## Mongoose Methods

- **`await User.create(data)`** - creates and saves a new document
- `new User(data)` - creates a new document instance (not saved yet)
- `await newUser.save()` - saves a document instance to the database
- **`await User.findOne(filter).exec()`** - finds a single document matching the filter
