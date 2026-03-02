'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Force drop all potential conflicting constraints using raw SQL
      await queryInterface.sequelize.query('ALTER TABLE "Expenses" DROP CONSTRAINT IF EXISTS "Expenses_wallet_id_fkey"', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE "Expenses" DROP CONSTRAINT IF EXISTS "Expenses_category_id_fkey"', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE "Budgets" DROP CONSTRAINT IF EXISTS "Budgets_category_id_fkey"', { transaction });

      // 2. Force change types with explicit casting (USING clause is key for Postgres)
      await queryInterface.sequelize.query('ALTER TABLE "Expenses" ALTER COLUMN "wallet_id" TYPE VARCHAR(255) USING "wallet_id"::text', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE "Expenses" ALTER COLUMN "category_id" TYPE VARCHAR(255) USING "category_id"::text', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE "Budgets" ALTER COLUMN "category_id" TYPE VARCHAR(255) USING "category_id"::text', { transaction });

      await transaction.commit();
      console.log('>>> [DB REPAIR] High-authority migration complete.');
    } catch (error) {
      await transaction.rollback();
      console.error('--- [DB REPAIR] Migration failed, rolling back ---', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => { }
};
