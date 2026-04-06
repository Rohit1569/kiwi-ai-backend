const db = require('../config/database');
const { DataTypes } = require('sequelize');

const UsageStats = db.sequelize.define('UsageStats', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  messages_sent_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  meetings_scheduled_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  emails_sent_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  cab_booking_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  other_feature_usage_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'UsageStats',
  timestamps: false,
  underscored: true
});

module.exports = UsageStats;
