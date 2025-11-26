const app = require('./app');
const { testConnection } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await testConnection();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
