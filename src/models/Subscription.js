const db = require('../config/database');
const { DataTypes } = require('sequelize');

const Subscription = db.sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  plan_type: {
    type: DataTypes.ENUM('free', 'paid'),
    defaultValue: 'free'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'expired'),
    defaultValue: 'active'
  }
}, {
  tableName: 'Subscriptions',
  underscored: true,
  timestamps: true
});

module.exports = Subscription;
