'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ExpenseItems', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      expense_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Expenses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      item_name: { type: Sequelize.STRING, allowNull: false },
      price: { type: Sequelize.DOUBLE, allowNull: false },
      quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('ExpenseItems');
  }
};
