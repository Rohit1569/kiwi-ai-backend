const { sequelize, DataTypes } = require('../config/database');

const Wallet = sequelize.define('Wallet', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  balance: { type: DataTypes.DOUBLE, defaultValue: 0.0 },
  created_at: { type: DataTypes.DATE, field: 'created_at' },
  updated_at: { type: DataTypes.DATE, field: 'updated_at' }
}, {
  tableName: 'Wallets',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Wallet;
