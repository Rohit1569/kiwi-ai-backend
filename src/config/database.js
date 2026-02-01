require('dotenv').config();
const { Sequelize } = require('sequelize');
const pg = require('pg');

const sequelizeOptions = {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  define: {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

if (process.env.DATABASE_URL) {
  // Fix for SSL warning and Neon compatibility
  sequelizeOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
  
  // If the URL doesn't already have sslmode, we can append it if necessary, 
  // but usually dialectOptions.ssl is enough for Sequelize.
}

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, sequelizeOptions)
  : new Sequelize(
      process.env.DB_NAME || 'apple_ai_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'password',
      {
        ...sequelizeOptions,
        host: process.env.DB_HOST || 'localhost'
      }
    );

module.exports = sequelize;
