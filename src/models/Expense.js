const { sequelize, DataTypes } = require('../config/database');

const Expense = sequelize.define('Expense', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DOUBLE, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  note: { type: DataTypes.TEXT }
}, {
  tableName: 'Expenses',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Expense;
