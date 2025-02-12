// whitelist
const allowedOrigins = [
  "http://www.yoursite.com", // your production site
  "http://yoursite.com", // alternate production site
  "http://127.0.0.1:5500", // local server for frontend development (e.g., using Live Server)
  "http://localhost:3500", // local server for backend development
  // "https://www.google.com", // example: allow google to access your API
];

module.exports = allowedOrigins;
