const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./middlewares/rateLimitMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // In production, set specific origin
  credentials: true,
}));
app.use(express.json());

// Rate Limiting
app.use('/api', apiLimiter);

// Routes
app.use('/api', routes);

// Error Handling
app.use(errorMiddleware);

module.exports = app;
