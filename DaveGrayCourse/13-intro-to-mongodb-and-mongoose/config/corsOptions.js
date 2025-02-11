const allowedOrigins = require("./allowedOrigins");

// const whitelist = [
//   "http://www.yoursite.com",
//   "http://yoursite.com",
//   "http://127.0.0.1:5500",
//   "http://localhost:3500",
// ];

const corsOptions = {
  origin: (origin, callback) => {
    // if (whitelist.indexOf(origin) !== -1 || !origin) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccesStatus: 200,
};

module.exports = corsOptions;
