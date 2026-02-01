require('dotenv').config();
const { Sequelize } = require('sequelize');
const pg = require('pg');

const sequelizeOptions = {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  define: {
    underscored: true, // Auto-map CamelCase to Snake_Case
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    freezeTableName: true // Prevents Sequelize from pluralizing table names
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, sequelizeOptions)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        ...sequelizeOptions
      }
    );

module.exports = sequelize;
