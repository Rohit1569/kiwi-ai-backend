const { sequelize, DataTypes } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
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
    allowNull: false,
    field: 'password_hash' 
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // LAYER 2: Explicit Attribute Mapping (The final shield)
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
  tableName: 'Users',
  timestamps: true,
  createdAt: 'created_at', // Redundant but safe
  updatedAt: 'updated_at'  // Redundant but safe
});

User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
