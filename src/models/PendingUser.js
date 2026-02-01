const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const PendingUser = sequelize.define('PendingUser', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otp_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'PendingUsers',
  underscored: true,
  timestamps: true, // Re-enabled but with explicit mapping below
  createdAt: 'created_at', // CRITICAL: This is the internal override
  updatedAt: 'updated_at',  // CRITICAL: This is the internal override
  hooks: {
    beforeCreate: async (pendingUser) => {
      if (pendingUser.password) {
        pendingUser.password = await bcrypt.hash(pendingUser.password, 10);
      }
    }
  }
});

module.exports = PendingUser;
