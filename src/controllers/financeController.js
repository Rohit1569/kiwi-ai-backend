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
    const expense = await Expense.create({
      id: req.body.id,
      user_id: req.user.id,
      // FIXED: Prioritize 'category' field from app
      category: req.body.category || req.body.categoryId || req.body.category_id || 'General',
      amount: req.body.amount,
      date: req.body.date ? new Date(req.body.date) : new Date(),
      note: req.body.note
    });
    console.log(`>>> [DB SUCCESS] Expense saved in ${expense.category}`);
    res.status(201).json(expense);
  } catch (error) {
    console.error('--- [DB ERROR] Expense Save Failed ---', error.message);
    res.status(400).json({ error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { user_id: req.user.id }, order: [['date', 'DESC']] });
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
      source: req.body.source,
      amount: req.body.amount,
      date: req.body.date ? new Date(req.body.date) : new Date(),
      note: req.body.note
    });
    console.log('>>> [DB SUCCESS] Income saved');
    res.status(201).json(income);
  } catch (error) {
    console.error('--- [DB ERROR] Income Save Failed ---', error.message);
    res.status(400).json({ error: error.message });
  }
};

const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.findAll({ where: { user_id: req.user.id }, order: [['date', 'DESC']] });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addBudget = async (req, res) => {
  try {
    await ensureUserExists(req.user.id);
    const budget = await Budget.create({
      id: req.body.id,
      user_id: req.user.id,
      // FIXED: Align with simplified category field
      category: req.body.category || req.body.categoryId || req.body.category_id || 'General',
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
    await ensureUserExists(req.user.id);
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
