const { sequelize, DataTypes } = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  parent_id: { type: DataTypes.UUID, allowNull: true },
  created_at: { type: DataTypes.DATE, field: 'created_at' },
  updated_at: { type: DataTypes.DATE, field: 'updated_at' }
}, {
  tableName: 'Categories',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Category;
