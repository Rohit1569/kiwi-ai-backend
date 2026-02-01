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
    allowNull: false
  }
}, {
  tableName: 'PendingUsers',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (pendingUser) => {
      if (pendingUser.password) {
        pendingUser.password = await bcrypt.hash(pendingUser.password, 10);
      }
    }
  }
});
