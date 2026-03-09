const { sequelize, DataTypes } = require('../config/database');

const FitnessProfile = sequelize.define('FitnessProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  middle_initial: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  body_type: {
    type: DataTypes.STRING, // Changed from ENUM to STRING for flexibility
    allowNull: false
  },
  water_intake: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  lifestyle: {
    type: DataTypes.STRING, // Changed from ENUM to STRING
    allowNull: false
  },
  exercise_flag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  exercise_per_day: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  exercise_per_week: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  exercise_per_month: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  food_type: {
    type: DataTypes.STRING, // Changed from ENUM to STRING
    allowNull: false
  },
  meals_per_day: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  outside_food_frequency: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'FitnessProfiles',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = FitnessProfile;
