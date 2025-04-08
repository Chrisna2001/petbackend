const env = process.env.NODE_ENV || 'development'; // Defaults to 'development'
require('dotenv').config({ path: `.env.${env}` }); // Loads .env.development or .env.production

console.log(`Using environment: ${env}`); // Verify which env is loaded

module.exports = {
  development: {
    // Configuration for development
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: process.env.DB_LOGGING === 'true',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true } : false,
    },
    retry: {
      max: 5, // Maximum retry attempts
      backoffBase: 1000, // Initial backoff delay in ms
      backoffExponent: 1.5,
    },
  },
  production: {
    // Configuration for production (if needed)
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: process.env.DB_LOGGING === 'true',
  },
};
