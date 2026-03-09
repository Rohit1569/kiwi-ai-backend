require('dotenv').config();
const pg = require('pg');

const sslConfig = {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  }
};

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') ? sslConfig : {}
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: sslConfig
  }
};
