const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UsageStats = sequelize.define('UsageStats', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  messages_sent_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  meetings_scheduled_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  emails_sent_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  cab_booking_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  other_feature_usage_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at'
  }
}, {
  tableName: 'UsageStats',
  timestamps: false
});

module.exports = UsageStats;
