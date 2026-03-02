'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reminders', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: { type: Sequelize.ENUM('bill', 'subscription', 'budget'), allowNull: false },
      reference_id: { type: Sequelize.UUID }, // ID of the related bill or subscription
      remind_at: { type: Sequelize.DATE, allowNull: false },
      note: { type: Sequelize.STRING },
      is_sent: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Reminders');
  }
};
