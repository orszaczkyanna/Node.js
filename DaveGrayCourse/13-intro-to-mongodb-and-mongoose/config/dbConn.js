// Connection Configuration

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect(uri, options);
    await mongoose.connect(process.env.DATABASE_URI, {
      // useUnifiedTopology: true, // deprecated option
      // useNewUrlParser: true, // deprecated option
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
