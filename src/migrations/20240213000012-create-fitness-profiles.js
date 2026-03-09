'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FitnessProfiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      middle_initial: {
        type: Sequelize.STRING(1),
        allowNull: true
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gender: {
        type: Sequelize.STRING, // Changed from ENUM to STRING
        allowNull: false
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      height: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      body_type: {
        type: Sequelize.STRING, // Changed from ENUM to STRING
        allowNull: false
      },
      water_intake: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      lifestyle: {
        type: Sequelize.STRING, // Changed from ENUM to STRING
        allowNull: false
      },
      exercise_flag: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      exercise_per_day: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      exercise_per_week: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      exercise_per_month: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      food_type: {
        type: Sequelize.STRING, // Changed from ENUM to STRING
        allowNull: false
      },
      meals_per_day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      outside_food_frequency: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FitnessProfiles');
  }
};
