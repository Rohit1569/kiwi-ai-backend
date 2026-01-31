require('dotenv').config();
const { Sequelize } = require('sequelize');
const pg = require('pg');

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectModule: pg, // CRITICAL FIX FOR VERCEL
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'apple_ai_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'password',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        dialectModule: pg, // CRITICAL FIX FOR VERCEL
        logging: false,
        define: {
          timestamps: true,
          underscored: true
        }
      }
    );

module.exports = sequelize;
