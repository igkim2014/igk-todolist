// src/server.js
const app = require("./app");
const { testConnection } = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// 리다이렉트 코드 삭제함 (app.js에서 직접 띄울 예정)

const startServer = async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
