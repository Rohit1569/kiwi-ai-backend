require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const pg = require('pg');

const dbUrl = process.env.DATABASE_URL;
const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

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

// EXPERT REPAIR: Physically purge 'wallet_id' and 'category_id' from DB
const repairSchema = async () => {
  if (!isLocal) return;
  try {
    console.log('>>> [REPAIR] Purging Ghost Columns from Database...');
    
    // Drop the problematic NOT NULL columns that were removed from the code
    await sequelize.query('ALTER TABLE "Expenses" DROP COLUMN IF EXISTS wallet_id');
    await sequelize.query('ALTER TABLE "Expenses" DROP COLUMN IF EXISTS category_id');
    
    // Add the new simple 'category' column if missing
    await sequelize.query('ALTER TABLE "Expenses" ADD COLUMN IF NOT EXISTS category VARCHAR(255)');
    await sequelize.query('ALTER TABLE "Budgets" ADD COLUMN IF NOT EXISTS category VARCHAR(255)');

    console.log('>>> [REPAIR] SUCCESS: Database is now 100% clean and Wallet-Free.');
  } catch (err) {
    console.error('>>> [REPAIR ERROR]', err.message);
  }
};

repairSchema();

module.exports = { sequelize, DataTypes };
