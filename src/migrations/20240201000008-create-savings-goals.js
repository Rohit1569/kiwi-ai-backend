'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SavingsGoals', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: { type: Sequelize.STRING, allowNull: false },
      target_amount: { type: Sequelize.DOUBLE, allowNull: false },
      current_amount: { type: Sequelize.DOUBLE, defaultValue: 0.0 },
      deadline: { type: Sequelize.DATE },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('SavingsGoals');
  }
};
