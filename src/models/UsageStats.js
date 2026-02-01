const { sequelize, DataTypes } = require('../config/database');

const UsageStats = sequelize.define('UsageStats', {
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
  other_feature_usage_count: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'UsageStats',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = UsageStats;
