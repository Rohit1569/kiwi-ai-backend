const { sequelize, DataTypes } = require('../config/database');

const ExpenseItem = sequelize.define('ExpenseItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  expense_id: { type: DataTypes.UUID, allowNull: false },
  item_name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DOUBLE, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  created_at: { type: DataTypes.DATE, field: 'created_at' },
  updated_at: { type: DataTypes.DATE, field: 'updated_at' }
}, {
  tableName: 'ExpenseItems',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ExpenseItem;
