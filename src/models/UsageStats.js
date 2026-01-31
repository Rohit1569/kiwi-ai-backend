const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

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
      model: User,
      key: 'id'
    }
  },
  messages_sent_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  meetings_scheduled_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  emails_sent_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  cab_booking_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  other_feature_usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

User.hasOne(UsageStats, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UsageStats.belongsTo(User, { foreignKey: 'user_id' });

module.exports = UsageStats;
