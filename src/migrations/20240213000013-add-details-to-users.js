'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update Users table
    await queryInterface.addColumn('Users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'address', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'cell_phone', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'reason_for_choice', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Update PendingUsers table
    await queryInterface.addColumn('PendingUsers', 'first_name', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('PendingUsers', 'last_name', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('PendingUsers', 'address', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('PendingUsers', 'cell_phone', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('PendingUsers', 'reason_for_choice', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'first_name');
    await queryInterface.removeColumn('Users', 'last_name');
    await queryInterface.removeColumn('Users', 'address');
    await queryInterface.removeColumn('Users', 'cell_phone');
    await queryInterface.removeColumn('Users', 'reason_for_choice');

    await queryInterface.removeColumn('PendingUsers', 'first_name');
    await queryInterface.removeColumn('PendingUsers', 'last_name');
    await queryInterface.removeColumn('PendingUsers', 'address');
    await queryInterface.removeColumn('PendingUsers', 'cell_phone');
    await queryInterface.removeColumn('PendingUsers', 'reason_for_choice');
  }
};
