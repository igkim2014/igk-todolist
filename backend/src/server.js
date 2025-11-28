// src/server.js
const app = require("./app");
const { testConnection } = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Test the database connection
testConnection().catch(console.error);

// For Vercel deployment
if (process.env.NODE_ENV === 'production') {
  // In production (Vercel), just export the app
  module.exports = app;
} else {
  // In development, start the server normally
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
