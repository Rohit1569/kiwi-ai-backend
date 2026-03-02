const { sequelize, DataTypes } = require('../config/database');

const SavingsGoal = sequelize.define('SavingsGoal', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { 
    type: DataTypes.UUID, 
    allowNull: false
  },
  title: { type: DataTypes.STRING, allowNull: false },
  target_amount: { type: DataTypes.DOUBLE, allowNull: false },
  current_amount: { type: DataTypes.DOUBLE, defaultValue: 0.0 },
  deadline: { type: DataTypes.DATE }
}, {
  tableName: 'SavingsGoals',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SavingsGoal;
