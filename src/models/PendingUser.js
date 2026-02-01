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
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at'
  }
}, {
  tableName: 'PendingUsers',
  timestamps: false, // We handle them manually above to avoid 'createdAt' errors
  hooks: {
    beforeCreate: async (pendingUser) => {
      if (pendingUser.password) {
        pendingUser.password = await bcrypt.hash(pendingUser.password, 10);
      }
    }
  }
});

module.exports = PendingUser;
