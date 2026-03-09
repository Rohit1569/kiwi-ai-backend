'use strict';

/**
 * Redundant migration after core schema cleanup.
 * Emptied to prevent 'column does not exist' errors during migration.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('>>> [DB SYNC] fix-finance-types: Already handled by core migrations. Skipping.');
  },

  down: async (queryInterface, Sequelize) => { }
};
