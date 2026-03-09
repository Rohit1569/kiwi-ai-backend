require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const pg = require('pg');

const dbUrl = process.env.DATABASE_URL;
const isLocal = dbUrl && (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1'));

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false, 
  dialectOptions: isLocal ? {} : {
    ssl: { require: true, rejectUnauthorized: false }
  },
  define: {
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = { sequelize, DataTypes };
