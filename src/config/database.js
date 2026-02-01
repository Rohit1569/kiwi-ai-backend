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

// If using Neon/Cloud Postgres, ensure SSL is configured correctly to avoid warnings and connection issues
if (process.env.DATABASE_URL) {
  sequelizeOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
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
