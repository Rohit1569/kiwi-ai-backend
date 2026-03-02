const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// --- EXPENSES ---
router.post('/expenses', financeController.addExpense);
router.get('/expenses', financeController.getExpenses);

// --- INCOMES ---
router.post('/incomes', financeController.addIncome);
router.get('/incomes', financeController.getIncomes);

// --- BUDGETS ---
router.post('/budgets', financeController.addBudget);
router.get('/budgets', financeController.getBudgets);

// --- SAVINGS ---
router.post('/savings-goals', financeController.addSavingsGoal);
router.get('/savings-goals', financeController.getSavingsGoals);

// --- UTILS ---
router.get('/categories', financeController.getCategories || ((req, res) => res.json([])));

module.exports = router;
