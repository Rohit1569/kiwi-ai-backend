'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM('user', 'admin'),
      defaultValue: 'user'
    });
    await queryInterface.addColumn('Users', 'is_active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'role');
    await queryInterface.removeColumn('Users', 'is_active');
    // Note: Drop ENUM if necessary, but standard removeColumn usually handles it or leaves it.
  }
};
