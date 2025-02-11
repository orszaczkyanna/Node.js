# [MongoDB](https://cloud.mongodb.com/)

**Setting up MongoDB on the Cloud**

- **Project** - a project to manage the database
- **Cluster** - a container for the databases
- **Database** - a structured collection of data (e.g., database: `CompanyDB`; collection: `employees`)
- **Database user** - an account with credentials to access the database (e.g., name: `mongotut`; password: `testing123`)
- **Allowed IP address** - controls which IPs can access the database
- **Connection String** - a URI used to connect the application to the database

# [mongoosejs](https://mongoosejs.com/)

Mongoose is an Object Data Modeling (ODM) library that simplifies interactions with MongoDB.

- Add the connection string to the `.env` file:

  ```
  DATABASE_URI=mongodb+srv://<username>:<password>...mongodb.net/<database_name>?retryWrites...
  ```

- Install [Mongoose](https://www.npmjs.com/package/mongoose): `npm i mongoose`

- [Connect](https://mongoosejs.com/docs/connections.html) to the database

- Ensure the server starts only after the MongoDB connection is successfully [established](https://mongoosejs.com/docs/connections.html#connection-events).

## Key Mongoose Methods

- `mongoose.connect(uri)` - connects to MongoDB using the provided connection string
- `mongoose.connection.once('open', () => {})` - executes the callback _once_ when the connection is established

## Usage

config/dbConn.js:

```javascript
// Connection Configuration
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect(uri, options);
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true, // deprecated option
      useNewUrlParser: true, // deprecated option
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
```

server.js:

```javascript
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

// Connect to MongoDB
connectDB();

// Start the server only after a successful database connection
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

# Notes

- `.once('open', callback)` - the callback runs only once when the connection is first established
- `.on('open', callback)` - the callback runs every time the event is emitted (e.g., if the connection is lost and reconnected)

Since we only need to _start the server_ when MongoDB connects _for the first time_, we use `.once('open')` instead of `.on('open')`.

- ODM (Object Data Modeling) - a layer that maps database documents to JavaScript objects for easier data handling
