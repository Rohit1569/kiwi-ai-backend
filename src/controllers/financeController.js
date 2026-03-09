const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const { sequelize } = require('../config/database');

const ensureUserExists = async (userId) => {
  const [results] = await sequelize.query(`SELECT id FROM "Users" WHERE id = '${userId}'`);
  if (results.length === 0) {
    await sequelize.query(`
      INSERT INTO "Users" (id, name, email, password_hash, is_verified, created_at, updated_at)
      VALUES ('${userId}', 'Mobile User', '${userId}@mobile.sync', 'placeholder', true, NOW(), NOW())
    `);
  }
};

const addExpense = async (req, res) => {
  try {
    await ensureUserExists(req.user.id);
    
    // MASTER SYNC: Handle both camelCase and underscores from mobile
    const expenseData = {
      id: req.body.id,
      user_id: req.user.id,
      category: req.body.category || 'General',
      amount: parseFloat(req.body.amount),
      note: req.body.note || '',
      date: req.body.date ? new Date(req.body.date) : new Date()
    };

    const expense = await Expense.create(expenseData);
    console.log(`>>> [CLOUD DB] Expense saved for user ${req.user.id}: $${expense.amount}`);
    res.status(201).json(expense);
  } catch (error) {
    console.error('--- [CLOUD ERROR] Failed to save expense ---', error.message);
    res.status(400).json({ error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ 
      where: { user_id: req.user.id }, 
      order: [['date', 'DESC']] 
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addIncome = async (req, res) => {
  try {
    await ensureUserExists(req.user.id);
    const income = await Income.create({
      id: req.body.id,
      user_id: req.user.id,
      source: req.body.source || 'Revenue',
      amount: parseFloat(req.body.amount),
      date: req.body.date ? new Date(req.body.date) : new Date(),
      note: req.body.note || ''
    });
    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.findAll({ 
      where: { user_id: req.user.id }, 
      order: [['date', 'DESC']] 
    });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addBudget = async (req, res) => {
  try {
    const budget = await Budget.create({
      id: req.body.id,
      user_id: req.user.id,
      category: req.body.category,
      monthly_limit: req.body.monthlyLimit || req.body.monthly_limit,
      month: req.body.month
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.findAll({ where: { user_id: req.user.id } });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.create({
      id: req.body.id,
      user_id: req.user.id,
      title: req.body.title,
      target_amount: req.body.targetAmount || req.body.target_amount,
      current_amount: req.body.currentAmount || 0
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.findAll({ where: { user_id: req.user.id } });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addExpense, getExpenses, addIncome, getIncomes, addBudget, getBudgets, addSavingsGoal, getSavingsGoals };
