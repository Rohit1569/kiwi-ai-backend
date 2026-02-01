require('dotenv').config();
const { Sequelize } = require('sequelize');
const pg = require('pg');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    timestamps: false, // SHUT OFF AUTOMATIC TIMESTAMPS GLOBALLY
    underscored: true,
    freezeTableName: true
  }
});

module.exports = sequelize;
