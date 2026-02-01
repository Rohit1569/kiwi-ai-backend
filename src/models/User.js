const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
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
    allowNull: false,
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },
  password: { 
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash' // Maps to the db column
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Users',
  underscored: true, // Forces snake_case for auto-generated columns
  timestamps: true
});

User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
