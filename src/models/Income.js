const { sequelize, DataTypes } = require('../config/database');

const Income = sequelize.define('Income', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { 
    type: DataTypes.UUID, 
    allowNull: false
  },
  source: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DOUBLE, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  note: { type: DataTypes.TEXT }
}, {
  tableName: 'Incomes',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Income;
