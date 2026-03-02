'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Expenses');

    // Make wallet_id nullable if it exists
    if (tableInfo.wallet_id) {
      await queryInterface.changeColumn('Expenses', 'wallet_id', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    // Make category_id nullable to avoid 'contains null values' error
    if (tableInfo.category_id) {
      await queryInterface.changeColumn('Expenses', 'category_id', {
        type: Sequelize.STRING,
        allowNull: true // Changed to TRUE to allow existing data
      });
    }

    const budgetTableInfo = await queryInterface.describeTable('Budgets');
    if (budgetTableInfo.category_id) {
      await queryInterface.changeColumn('Budgets', 'category_id', {
        type: Sequelize.STRING,
        allowNull: true // Changed to TRUE to allow existing data
      });
    }
  },

  down: async (queryInterface, Sequelize) => { }
};
