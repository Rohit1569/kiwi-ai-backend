const { sequelize, DataTypes } = require('../config/database');

const Budget = sequelize.define('Budget', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { 
    type: DataTypes.UUID, 
    allowNull: false
  },
  category: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  monthly_limit: { 
    type: DataTypes.DOUBLE, 
    allowNull: false
  },
  month: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'Budgets',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Budget;
